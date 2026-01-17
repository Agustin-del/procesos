const { Worker, parentPort, workerData, isMainThread} = require('node:worker_threads')

async function mainPipeline(input) {
  const stages = [
    stage1,
    stage2,
    stage3
  ]

  let currentInput = input

  for(const stage of stages){
    currentInput = await executeInWorker(stage, currentInput)
  }
  return currentInput
}

function executeInWorker(workerFunction, input) {
  return new Promise((res, rej) => {
    const workerCode = `
      const { workerData, parentPort } = require('worker_threads');
      (${workerFunction.toString()})(workerData)
        .then(result => parentPort.postMessage({result}))
        .catch(error => parentPort.postMessage({error}));
    `
    const worker = new Worker(workerCode, {
      eval:true,
      workerData:input
    })

    worker.on('message', msg => {
      if(msg.error){
        rej(new Error(msg.error))
      } else {
        res(msg.result)
      }
    })

    worker.on('error', rej)
    worker.on('exit', code => {
      if(code !== 0){
        rej(new Error('Worker stopped with code: ', code))
      }
    })

  })
}

async function stage1(input){
  await new Promise(res => {
    setTimeout(res, 1000)
  })
  return input.toUpperCase()
}

async function stage2(input){
  await new Promise(res => {
    setTimeout(res, 1000)
  })
  return input.split('').reverse().join('')
}

async function stage3(input){
  await new Promise(res => {
    setTimeout(res, 1000)
  })

  return `Resultado final: ${input}`
}

if(isMainThread) {
  const inputData = 'ejemplo'

  mainPipeline(inputData)
    .then(finalResult => {
      console.log(finalResult)
    })
    .catch(e => console.error(e))
}
