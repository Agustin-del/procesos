const os = require('node:os')
const {Worker, isMainThread, parentPort} = require('node:worker_threads')
const http = require('node:http')

const numWorkers = 4
let workers = []
let index = 0
const requestsMap = new Map()

if(isMainThread) {

  let totalCpu = 0
  let totalMemory = 0

  for(let i = 0; i < numWorkers; i++){
    const worker = new Worker(__filename)
    workers.push(worker)

    worker.on('message', data => {
    if(data.type === 'metrics'){
      totalCpu += data.cpu.user + data.cpu.system
      totalMemory += data.memory.rss
    } else if (data.type === 'response') {
      const res = requestsMap.get(data.id)
      if(res) {
        res.writeaHead(200)
        res.end(`Processed: ${data.message}`)
        requestsMap.delete(data.id)
      }
    }
   })
  }

  const server = http.createServer((req, res) => {
    const worker = workers[index % workers.length]
    index++

    const requestId = Date.now() + Math.random()
    requestsMap.set(requestId, res)

    worker.postMessage({type: 'process_request', id: requestId})
  })

  setInterval(() => {
    //const usage = process.resourceUsage()
    console.log(`Total CPU: ${((totalCpu + usage.userCPUTime)/ 1e6).toFixed(2)} | Total memory: ${((totalMemory + usage.maxRSS)/ 1024 / 1024).toFixed(2)}mb `)
  }, 5000)

  server.listen(3000, () => {
    console.log('Server running on http://localhost:3000')
  })
} else {
  parentPort.on('message', (msg) => {
    if(msg.type === 'process_request'){
      const startCpu = process.cpuUsage()
      setTimeout(() => {
        const endCpu = process.cpuUsage(startCpu)
        const memory = process.memoryUsage()
        parentPort.postMessage({type: 'metrics', cpu: endCpu, memory})
        parentPort.postMessage({type:'response', message:'Request processed'})
      }, 1000)
    }
  })
}

