// @architect/functions enables secure sessions, express-style middleware and more
let arc = require('@architect/functions')
let data = require('@architect/data')
//let sortBy = require('lodash.sortby');
// let url = arc.http.helpers.url

async function handler(req, res) {
  console.log(JSON.stringify(req, null, 2))
  let stopID = req.params.stopID
  let result = await data.stop.query({
    KeyConditionExpression: 'stop_id = :stopID',
    ExpressionAttributeValues: {
      ':stopID': stopID
      }
    })
  res({
    json: result.Items
  })
}

exports.handler = arc.http(handler)
