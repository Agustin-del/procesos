const { Worker } = require('node:worker_threads')

class TaskScheduler {
  constructor(){
    this.taskQueue = []
    this.currentWorker = null
  }

  addTask(workerFile, data, quantum){
    this.taskQueue.push({workerFile, data, quantum})
    if(!this.currentWorker){
      this.runNextTask()
    }
  }

  runNextTask(){
    if(this.taskQueue.length === 0){
      this.currentWorker = null 
      return
    }

    const { workerFile, data, quantum } = this.taskQueue.shift()
    const worker = new Worker(workerFile, {workerData: data})

    this.currentWorker = { worker, quantum, startTime: Date.now()}

    const timer = setTimeout(() => {
      if (this.currentWorker?.worker === worker){
        console.log(`Task interrupted, requeued with quantum ${quantum + 100}ms`)
        this.taskQueue.push({workerFile, data, quantum: Math.min(quantum + 100, 2000)})
        worker.terminate()
        this.runNextTask()
      }
    }, quantum)

    worker.on('message', msg => {
      console.log('Task completed', msg)
      clearTimeout(timer)
      this.runNextTask()
    })

    worker.on('exit', () => {
      if (worker === this.currentWorker?.worker){
        this.currentWorker= null
      }
    })
  }
}


const scheduler = new TaskScheduler()

scheduler.addTask('./worker.js', {value:5}, 500)
scheduler.addTask('./worker.js', {value:10}, 300)
scheduler.addTask('./worker.js', {value:7}, 400)
