const http = require('node:http')

let totalCpu = 0 
let totalMemory = 0

const server = http.createServer((req, res) => {
  const startCpu = process.cpuUsage()
  setTimeout(() => {
    totalCpu += process.cpuUsage(startCpu).user
    totalMemory += process.memoryUsage().rss
    res.writeHead(200)
    res.end('request_processed')
  }, 1000)

})

setInterval(() => {
  console.log(`Total CPU: ${(totalCpu / 1e6).toFixed(2)}s | Memoria: ${(totalMemory / 1024 / 1024).toFixed(2)}mb`)

},5000)

server.listen(3000, () => {
  console.log('Servidor escuchando en http://localhost:3000')
})
