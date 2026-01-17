const http = require('node:http')
const os = require('node:os')
const cluster = require('node:cluster')

const numCpus = os.cpus().length
let totalCpu = 0
let totalMemoria = 0

if(cluster.isMaster) {
  const start = process.cpuUsage()
  console.log('Numero de cpus: ' + numCpus)
  console.log('Proceso master ejecutándose...')

  for(let i = 0; i < numCpus; i++){
    cluster.fork()
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`El worker ${worker.process.pid} terminó`)
  })

  setInterval(() => {
    for(const id in cluster.workers){
      const worker = cluster.workers[id]
      if(worker) {
        worker.on('message', msg => {
          if(msg.type === 'metrics'){
            totalCpu += msg.cpu
            totalMemoria += msg.memory
          }
        })
      }
    }
  
  setTimeout(() => {
    console.log(`Total Cpu: ${((totalCpu + process.cpuUsage(start).user) / 1e6).toFixed(2)}s | Memoria: ${((totalMemoria + process.memoryUsage().rss) / 1024 / 1024).toFixed(2)}mb`)
  }, 1000)

  }, 5000)
} else {
  http.createServer((req, res) => {
    res.writeHead(200, { "content-type":'text/plain'})
    res.end('Hola desde el servidor hijo')
  }).listen(3000, () => {
    console.log('Worker ' + process.pid +  ' escuchando en http://localhost:3000')

    const startCpu = process.cpuUsage()
    const startMemory = process.memoryUsage().rss

    setInterval(() => {
      const cpuUsage = process.cpuUsage(startCpu).user
      const memoryUsage = process.memoryUsage().rss - startMemory
      process.send({type:'metrics', cpu:cpuUsage, memory:memoryUsage})
    }, 1000)
  })
}
