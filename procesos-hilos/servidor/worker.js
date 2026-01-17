const { parentPort } = require('node:worker_threads')

parentPort.on('message', (msg) => {
    if(msg === 'calculate') {
        let sum = 0
        for(let i = 0; i < 1e9; i++) sum += i
        parentPort.postMessage(sum)

    }
})
