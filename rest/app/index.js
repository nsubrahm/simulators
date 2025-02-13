const simulator = require('./client/client')

const BASE_URL = process.env.BASE_URL || 'http://host.docker.internal:80'
const API_ENDPOINT = process.env.API_ENDPOINT || '/data'
const TZ = process.env.TZ || 'Asia/Kolkata';

console.log(`Starting simulator for API end-point at: ${BASE_URL}${API_ENDPOINT}`)

simulator.simulate({
  TZ: TZ,
  BASE_URL: BASE_URL,
  API_ENDPOINT: API_ENDPOINT
})
