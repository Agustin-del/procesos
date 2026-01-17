const { fork } = require('node:child_process')

if(process.argv[2] === 'child'){
  function isPrime (num){
    if(num < 2) return false
    for(let i = 2; i <= Math.sqrt(num); i++) {
      if(num % i === 0) return false
    }

    return true
  }

  function findPrimes(start, end){
    let primes = []
    for(let i = start; i <= end; i++){
      if(isPrime(i)){
        primes.push(i)
      } 
    }
    return primes
  }

  const start = parseInt(process.argv[3])
  const end = parseInt(process.argv[4])

  const primes = findPrimes(start, end)

  process.send(primes)
  process.exit()
} else {
  const numProcess = 4
  const limit = 1e6
  const chunkSize = Math.ceil(limit / numProcess)
  let results = []
  let completedProcess = 0

  const startTime = process.hrtime()

  for(let i = 0; i < numProcess; i++){
    const start = i * chunkSize + 1
    const end = Math.min((i + 1) * chunkSize, limit)

    const child = fork(__filename, ['child', start, end])
  
    child.on('message', (primes) => {
      results = results.concat(primes)
      completedProcess++

      if(completedProcess === numProcess){
        const endTime = process.hrtime(startTime)
        console.log(`Encontrados ${results.flat().length} primos`)
        console.log(`Tiempo: ${endTime[0]}s ${endTime[1] / 1e6}ms`)
      }
    })
  }
}
