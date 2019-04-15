// @architect/functions enables secure sessions, express-style middleware and more
let arc = require('@architect/functions')
let data = require('@architect/data')
//let sortBy = require('lodash.sortby');
// let url = arc.http.helpers.url

async function handler(req, res) {
  console.log(JSON.stringify(req, null, 2))
  let routeID = req.params.routeID
  let result = await data.trip.query({
    KeyConditionExpression: 'route_id = :routeID',
    ExpressionAttributeValues: {
      ':routeID': routeID
      }
    })
  res({
    json: result.Items
  })
}

exports.handler = arc.http(handler)
