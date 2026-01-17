const Fastify = require('fastify')

const fastify = Fastify()
let totalCpu = 0
let totalMemoria = 0

fastify.get('/', (req, res) => {
  const start = process.cpuUsage()
  setTimeout(()=> {
    totalCpu += process.cpuUsage(start).user
    totalMemoria += process.memoryUsage().rss
  
    res.send('request_processed')
  }, 1000)
})

setInterval(() => {
  console.log(`Total CPU: ${(totalCpu / 1e6).toFixed(2)}s | Memoria: ${(totalMemoria / 1024 / 1024).toFixed(2)}mb`)

},5000)

fastify.listen({port:3000}, (err) => {
  if(err)
    console.error(err)
  console.log('servidor escuchando en http://localhost:3000')
})



