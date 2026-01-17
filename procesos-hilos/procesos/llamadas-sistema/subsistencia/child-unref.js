const fs = require('node:fs')

setInterval(() => {
  fs.appendFileSync('./log.txt', 'Hijo sigue vivo... \n')
}, 1000)
