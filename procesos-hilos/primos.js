function isPrime(num){
  if(num < 2) return false

  for(let i = 2; i <= Math.sqrt(num); i++){
    if(num % i === 0) return false
  }

  return true
}

function findPrimes(limit) {
  let primes = []

  for (let i = 2; i <= limit; i++){
    if(isPrime(i)) primes.push(i)
  }

  return primes
}

const startTime = process.hrtime()

let results = findPrimes(1e6)

const endTime = process.hrtime(startTime)

console.log(`Primos encontrados: ${results.length}`)
console.log(`Tiempo transcurrido: ${endTime[0]}s ${endTime[1] / 1e6}ms`)
