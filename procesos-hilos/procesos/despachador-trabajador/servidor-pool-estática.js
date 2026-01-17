const { fork } = require('node:child_process')
const http = require('node:http')

const numWorkers = 4
let index = 0
let totalCpu = 0
let totalMemory = 0
let requestsMap = new Map()

if(process.argv[2] === 'worker'){
  const startCpu = process.cpuUsage()
  process.on('message', (msg) => {
    if(msg === 'process_request'){
      const endCpu = process.cpuUsage(startCpu).user
      const memory = process.memoryUsage().rss

      //setTimeout(() =>{
        
        process.send({type:'metrics', cpu:endCpu, memory})
        process.send({type:'response', message:'Request processed'}),1000
      
      //}, 200)
    }
  })
} else {
  const workers = []
  for(let i = 0; i < numWorkers; i++){
    const worker = fork(__filename, ['worker'])
    workers.push(worker)
    worker.on('message', msg => {
      if(msg.type === 'metrics'){
        totalCpu += msg.cpu  
        totalMemory += msg.memory
      } else if(msg.type === 'response'){
        const res = requestsMap.get(msg.id)
        if(res) {
          res.writeHead(200)
          res.end(`Processed: ${msg.message}`)
          requestsMap.delete(msg.id)
        }
      }
    })

  }

  const server = http.createServer((req, res) => {
    const worker = workers[index % workers.length]
    index++

    const requestId = Date.now() + Math.random()
    requestsMap.set(requestId, res)

    worker.send('process_request')
  })

  setInterval(() => {
    console.log(`Total Cpu: ${(totalCpu / 1e6).toFixed(2)}s | Memoria: ${(totalMemory / 1024 / 1024).toFixed(2)}mb`)
  }, 5000)

  server.listen(3000, () => {
    console.log('Servidor escuchando en http://localhost:3000')
  })
}
