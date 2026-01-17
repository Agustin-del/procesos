const {Worker} = require('worker_threads')

const worker = new Worker(`
    console.log('Hola desde el worker');
  `, {eval:true})

worker.on('exit', () => console.log('worker finalizado'))
