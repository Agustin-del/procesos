const { fork } = require('node:child_process')
const { performance } = require('node:perf_hooks')

const start = performance.now()

if(process.argv[2] === 'child') {
    process.on('message', data => {
        process.send('Respuesta desde el hijo')
        process.exit(0)
    })
} else {
    
    const child = fork(__filename, ['child'])
    child.on('message', (msg) => {
        console.log(`Padre recibió: ${msg}`)
        console.log(`⏱ Tiempo con fork(): ${performance.now() - start} ms`)
    })
    child.send('Hola desde el padre')
    
}
