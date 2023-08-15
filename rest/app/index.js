const simulator = require('./client/client')

const BASE_URL = process.env.BASE_URL
const API_ENDPOINT = process.env.API_ENDPOINT
const TZ = process.env.TZ || 'Asia/Kolkata';

console.log(`Starting simulator for API end-point at: ${BASE_URL}${API_ENDPOINT}`)

simulator.simulate({
  TZ: TZ,
  BASE_URL: BASE_URL,
  API_ENDPOINT: API_ENDPOINT
})
