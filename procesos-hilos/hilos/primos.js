const { Worker, isMainThread, parentPort, workerData } = require('worker_threads')

if(!isMainThread){
  function isPrime(num){
      if(num < 2) return false

    for(let i = 2; i <= Math.sqrt(num); i++){
      if(num % i === 0) return false
    }

    return true
  }

  function findPrimes(start, end) {
    let primes = []

    for (let i = start; i <= end; i++){
      if(isPrime(i)) primes.push(i)
    }

    return primes
  }

  const primes = findPrimes(workerData.start, workerData.end)
  parentPort.postMessage(primes)
} else {
  const numWorkers = 4
  const limit = 1e6
  const chunkSize = Math.ceil(limit / numWorkers)
  let workers = []
  let results = []
  let completedWorkers = 0

  const startTime = process.hrtime()

  for(let i = 0; i < numWorkers; i++){
    const start = i * chunkSize + 1
    const end = Math.min((i + 1) * chunkSize, limit)

    workers[i] = new Worker(__filename, {workerData:{start,end}})

    workers[i].on('message', (primes) => {
      results = results.concat(primes)
      completedWorkers++
      if(completedWorkers === numWorkers){
        const endTime = process.hrtime(startTime)
        console.log(`Encontrados ${results.flat().length} primos`)
        console.log(`Tiempo: ${endTime[0]}s ${endTime[1] / 1e6}ms`) 
      }
    })
  }
}
