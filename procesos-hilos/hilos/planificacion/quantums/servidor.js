const { Worker } = require('node:worker_threads')
const Fastify = require('fastify')

const fastify = Fastify()
const taskQueue = []
const activeWorkers = new Set()
const BASE_QUANTUM = 500 

function getQuantum(){
  return Math.max(BASE_QUANTUM / Math.max(activeWorkers.size, 1), 500)
}

function runNextTask(){
  if(taskQueue.length === 0) return

  const {workerFile, data, quantum} = taskQueue.shift()
  const worker = new Worker(workerFile, {workerData:data})
  activeWorkers.add(worker)

  const timer = setTimeout(() => {
    worker.terminate()
    activeWorkers.delete(worker)
    const newQuantum = Math.min(quantum * 2, BASE_QUANTUM)
    console.log(`Task interrupted, requeued with quantum ${newQuantum}ms`)
    taskQueue.push({workerFile, data, quantum:newQuantum})
    runNextTask()
  }, quantum)

  worker.on('message', msg => {
    console.log(`Worker (${workerFile}): `, msg)
    clearTimeout(timer)
    activeWorkers.delete(worker)
    runNextTask()
  }) 

  worker.on('exit', () => {
    activeWorkers.delete(worker)
    runNextTask()
  })
}

fastify.post('/task', async (req, rep) => {
  const { workerFile, data } = req.body
  taskQueue.push({workerFile, data, quantum: getQuantum()})
  runNextTask()
  return { message: 'Task added'}
})

fastify.listen({port:3000}, (err) => {
  if(err) throw err
  console.log('server running on http://localhost:3000')
})
