module.exports = function layout(head,body) {
  return `
  <html>
    <head>
      ${head}
    </head>  
    <body>
      ${body}
    </body>
  </html>
  `
}