const { Worker } = require('node:worker_threads')

function createWorker(workerFile, inputData){
  return new Promise((res, rej) => {
    const worker = new Worker(workerFile, {workerData: inputData})

    worker.on('message', res)
    worker.on('error', rej)
    worker.on('exit', code => {
      if(code !== 0 ){
        rej(new Error(`Worker exited with code: ${code}`))
      }
    })
  })
}

async function runTeamModel(){
  try{
    const [mathResult, textResult, dateResult] = await Promise.all([
      createWorker('./workerMath.js', {operation:'square', value:5}),
      createWorker('./workerText.js', {operation:'uppercase', text:'hello'}),
      createWorker('./workerDate.js', {operation:'format', date: Date.now()})
    ])

    console.log(`Math Worker Result: ${mathResult}`)
    console.log(`Text Worker Result: ${textResult}`)
    console.log(`Date Worker Result: ${dateResult}`)
  } catch (e){
    console.error('Error in team model: ', e)
  }
}

runTeamModel()
