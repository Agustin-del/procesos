const http = require('node:http')
const { Worker } = require('node:worker_threads')
const url = require('node:url') 

function executeWorker(workerFile, inputData){
  return new Promise((res, rej) => {
    const worker = new Worker(workerFile, {workerData:inputData})

    worker.on('message', res)
    worker.on('error', rej)
    worker.on('exit', code => {
      if(code !== 0){
        rej(new Error('Worker exited with code: ', code))
      }
    })
  })
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true)
  const { pathname, query} = parsedUrl

  let workerFile = null 
  let inputData = {}

  switch(pathname) {
    case '/math':
      workerFile = './workerMath.js'
      inputData = {operation: query.op, value:Number(query.value)}
      break
    case '/text':
      workerFile = './workerText'
      inputData = {operation: query.op, text: query.text}
      break
    case '/date':
      workerFile = './workerDate'
      inputData = {operation: query.op, date: Date.now()}
      break
    default:
      res.writeHead(404, {"content-type": 'text/plain'})
      res.end('not found')
      return
  }

  try {
    const result = await executeWorker(workerFile, inputData)
    res.writeHead(200, {"content-type":'application/json'})
    res.end(JSON.stringify({result}))
  } catch(e){
    res.writeHead(500, {"content-type":'application/json'})
    res.end(JSON.stringify({error:e.message}))
  }
})

server.listen(3000, () => {
  console.log('RPC server running at http://localhost:3000')
})
