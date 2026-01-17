const { fork } = require('node:child_process')

const worker = fork('worker.js')
function waitWorker(worker){
  return new Promise((res, rej) => {
    worker.on('message', msg => {
      if(msg === 'Trabajo terminado'){
        res('El hijo terminó')
      } else {
        rej('error en el proceso hijo')
      }
    })
  })
}

async function main(){
  console.log('esperando al hijo')

  try{
    const result = await waitWorker(worker)
    console.log(result)
  } catch(e){
    console.error(e)
  }

  console.log('fin del padre')
}

main()
