process.on('SIGINT', () => {
    console.log('Se recibió SIGINT saliendo')
    process.exit()
})

setInterval(() => {}, 1000)