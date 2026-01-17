const { Worker } = require('node:worker_threads')
const Fastify = require('fastify')

const fastify = Fastify({logger:true})

const priorityQueue = []
let currentWorker = null

function addTask(workerFile, data, priority){
  priorityQueue.push({workerFile, data, priority})
  priorityQueue.sort((a,b) => b.priority - a.priority)

  if(currentWorker && priorityQueue[0].priority > currentWorker.priority){
  console.log(`Higher priority task (${priority})`)
    priorityQueue.push({
      workerFile:currentWorker.workerFile,
      data:currentWorker.data,
      priority:currentWorker.priority
    })

    currentWorker.worker.terminate()
    currentWorker = null
    setTimeout(runNextTask, 10)
  } else if(!currentWorker){
    runNextTask()
  }
}

function runNextTask(){
  if(priorityQueue.length === 0){
    currentWorker = null
    return
  }

  const { workerFile, data, priority } = priorityQueue.shift()
  const worker = new Worker(workerFile, {workerData: data})

  currentWorker = {worker, workerFile, data, priority}
  
  worker.on('message', msg => {
    console.log(`Worker (${workerFile}, priority ${priority}): `, msg)
    runNextTask()
  })

  worker.on('exit', () => {
    if(worker === currentWorker?.worker){
      currentWorker = null
    }
  })
}

fastify.post('/task', async (req, rep) => {
  const { workerFile, data, priority } = req.body
  console.log(workerFile, data, priority)
  console.log(req.body)
  addTask(workerFile, data, priority)
  return {message:'Task added'}
})

fastify.listen({port: 3000},(err) => {
  if(err) throw err
  console.log('corriendo en http://localhost:3000')
})
