const {fork} = require('child_process')

const child = fork('child-fork.js')

child.send('hola desde el padre')
child.on('message', msg => console.log('hijo: ', msg))
