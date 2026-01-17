const { Worker, threadId } = require('worker_threads')

const worker = new Worker('./worker.js')

