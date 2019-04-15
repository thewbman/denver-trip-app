// @architect/functions enables secure sessions, express-style middleware and more
let arc = require('@architect/functions')
let data = require('@architect/data')
//let sortBy = require('lodash.sortby');
// let url = arc.http.helpers.url

async function handler(req, res) {
  let myroutes = await data.route.scan({})
  res({
    json: myroutes.Items.sort(function(a,b) { if(a.route_id < b.route_id) return -1; return 1; } )
  })
}

exports.handler = arc.http(handler)
