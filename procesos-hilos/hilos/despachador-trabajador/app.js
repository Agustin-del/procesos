const { Worker, isMainThread, parentPort, threadId} = require('node:worker_threads')
const {performance} = require('node:perf_hooks')

if(isMainThread){
  const numWorkers = 4
  const workers = []
  const clientRequests = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  let completedRequests = 0
  let startTime

  for(let i = 0; i < numWorkers; i++){
    const worker = new Worker(__filename)
    
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
  startTime = performance.now()

  clientRequests.forEach(request => {
    workers[currentWorker].postMessage(request)
    currentWorker = (currentWorker + 1) % numWorkers
  })
} else {
  parentPort.on('message', request => {
    console.log(`worker ${threadId} processing request ${request}`)

    const result = request * 2

    console.log(`worker ${threadId} finished processing request: ${request}, result: ${result}`)
    
    parentPort.postMessage('done')
  })
}
