setTimeout(() => {
  process.send('Trabajo terminado')
  console.log('hola')
  process.exit(0)
}, 1000)
