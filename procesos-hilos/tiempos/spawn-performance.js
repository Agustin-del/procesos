const { spawn } = require('node:child_process')
const { performance } = require('node:perf_hooks')

const start = performance.now()

if(process.argv[2] === 'child') {
    process.stdin.on('data', (data) => {
        console.log('Respuesta desde el hijo')
        process.exit(0)
    })

} else {
    const child = spawn('node', [__filename, 'child'])
    
    child.stdout.on('data', data => {
        console.log(`Padre recibió: ${data.toString()}`)
        console.log(`⏱ Tiempo con spawn(): ${performance.now() - start} ms`);
    })

    child.stdin.write('Hola desde el padre')
}
