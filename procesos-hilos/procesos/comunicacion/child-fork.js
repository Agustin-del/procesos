process.on('message', msg => {
  console.log('Padre: ', msg)
  process.send('hola desde el hijo')
})

