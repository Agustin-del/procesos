const { fork } = require('node:child_process')
const { performance } = require('node:perf_hooks')

const numWorkers = 4
const workers = []
const clientRequests = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
let completedRequests = 0

for (let i = 0; i < numWorkers; i++){
  const worker = fork('worker.js')
  worker.on('message', msg => {
    if(msg === 'done'){
      completedRequests++
      
      if(completedRequests === clientRequests.length){
        const endTime = performance.now()
        console.log(`Total time: ${endTime - startTime}ms`)
        process.exit()
      }
    }
  })
  workers.push(worker)
}

let currentWorker = 0

const startTime = performance.now()

clientRequests.forEach(request => {
  workers[currentWorker].send(request)
  currentWorker = (currentWorker + 1) % numWorkers
})
