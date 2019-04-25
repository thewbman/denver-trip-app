// @architect/functions enables secure sessions, express-style middleware and more
let arc = require('@architect/functions')
let data = require('@architect/data')
//let sortBy = require('lodash.sortby');
// let url = arc.http.helpers.url

async function handler(req, res) {
  console.log(JSON.stringify(req, null, 2))
  let tripID = req.params.tripID
  let result = await data.stoptime.query({
    KeyConditionExpression: 'trip_id = :tripID',
    ExpressionAttributeValues: {
      ':tripID': tripID
      }
    })

  for(var i = 0, len = result.Items.length; i < len; i++) {
    let stopID = result.Items[i].stop_id
    let stopresult = await data.stop.query({
      KeyConditionExpression: 'stop_id = :stopID',
      ExpressionAttributeValues: {
        ':stopID': stopID
        }
      })
      
    if(stopresult.Items.length > 0) {
      result.Items[i].stop = stopresult.Items[0];
    }
  }


  
  res({
    json: result.Items.sort(function(a,b) { if(a.arrival_time < b.arrival_time) return -1; return 1; } )
  })
}

exports.handler = arc.http(handler)
