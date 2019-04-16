var fs = require('fs');
var parse = require('csv-parse');
var async = require('async');
//var ddb = require('dynamodb');
var AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient({convertEmptyValues: true, region: "us-west-2"})





//var csv_filename = "../data_download/routes.txt";
//var table_name = "denvertrip-staging-route";

var csv_filename = process.argv[2];
var table_name = process.argv[3];

console.log(csv_filename);
console.log(table_name);


rs = fs.createReadStream(csv_filename);
parser = parse({
    columns : true,
    delimiter : ','
}, function(err, data) {


    var split_arrays = [], size = 1;

    while (data.length > 0) {
        split_arrays.push(data.splice(0, size));
	//console.log("parsed "+split_arrays.length+" lines from file");
	
    }


    data_imported = false;
    chunk_no = 1;

    //split_arrays.length = 1;

    //console.log(JSON.stringify(split_arrays[0]));

    async.each(split_arrays, function(item_data, call_back) {
        var my_req = { RequestItems: { [table_name] : [ {PutRequest: { Item: item_data[0] } } ] } };
	//console.log(JSON.stringify(my_req));
	
        ddb.batchWrite(
            my_req
        ,  function(err, res, cap) {
            //console.log('done going next');
            if (err == null) {
                console.log('Success chunk #' + chunk_no);
                data_imported = true;
            } else {
                console.log(err);
                console.log('Fail chunk #' + chunk_no);
		console.log(JSON.stringify(my_req));
                data_imported = false;
            }
            chunk_no++;
            call_back();
        });

    }, function() {
        // run after loops
        console.log('all data imported....');

    });

});
rs.pipe(parser);