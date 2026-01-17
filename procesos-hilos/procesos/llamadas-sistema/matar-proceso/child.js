setTimeout(() => {
    process.send('hola desde el proceso hijo')
}, 2000)