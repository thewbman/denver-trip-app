// @architect/functions enables secure sessions, express-style middleware and more
let arc = require('@architect/functions')
let data = require('@architect/data')
// let url = arc.http.helpers.url

async function handler(req, res) {
  let myroutes = await data.route.scan({})
  res({
    json: myroutes
  })
}

exports.handler = arc.http(handler)
