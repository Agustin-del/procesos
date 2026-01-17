const { Worker } = require('node:worker_threads')

const priorityQueue = []

function addWorker(workerFile, data, priority){
  priorityQueue.push({workerFile, data, priority})
  priorityQueue.sort((a, b) => b.priority - a.priority)
}

async function runWorkers(){
  while(priorityQueue.length > 0){
    const { workerFile, data } = priorityQueue.shift()

    await new Promise((res, rej) => {
      const worker = new Worker(workerFile, {workerData:data})

      worker.on('message', msg => {
        console.log(`Worker ${workerFile}: ${msg}`)
        res()
      })

      worker.on('error', rej)
      worker.on('exit', code => {
        if(code !== 0) {
          rej(new Error(`Worker exited with code: ${code}`))
        }
      })
    })
  }
}

addWorker('./workerA.js', {value: 5}, 5)
addWorker('./workerB.js', {value: 10}, 2)
addWorker('./workerC.js', {value: 7}, 3)

runWorkers()
