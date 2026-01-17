const { exec } = require('node:child_process')

console.log('Esperando 3 segundos')
exec('sleep 3', () => {
    console.log('listoo')
})

// preferible usar setTimeout, no? Es decir interfaz común proporcionada por js. Además del overhead de crear otro proceso.