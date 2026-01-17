const { Worker, isMainThread, parentPort } = require('node:worker_threads')

function logMemoryUsage(label) {
    const usage = process.memoryUsage()
    console.log(`${label} - RSS: ${(usage.rss / 1024 / 1024).toFixed(2)} MB, Heap Used: ${(usage.heapUsed / 1024 / 1024).toFixed(2)} MB`)
}

if(isMainThread) {
    logMemoryUsage('Before workers')

    const workers = []
    const numWorkers = 4
    let totalRSS = 0
    let totalHeap = 0
    let completedWorkers = 0

    for (let i = 0; i < numWorkers; i++) {
        const worker = new Worker(__filename)
        workers.push(worker)

        worker.on('message', data => {
          totalRSS += data.rss
          totalHeap += data.heapUsed
          completedWorkers++ 

          if(completedWorkers === numWorkers){
            console.log(`RSS: ${(totalRSS / 1024 / 1024).toFixed(2)} MB, Heap Used: ${(totalHeap / 1024 / 1024).toFixed(2)} MB`)
          }
        })

    }
    

} else {
    const arr = Array.from({length: 1e7}, () => Math.random())

    parentPort.postMessage(process.memoryUsage())
}
