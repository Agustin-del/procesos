const { fork } = require('node:child_process')

const child = fork('child.js')

process.exit()
