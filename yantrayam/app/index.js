const simulator = require('./client/client')

const BASE_URL = process.env.BASE_URL || 'https://monitor.yantrayam.in/api/payload'
const API_ENDPOINT = process.env.API_ENDPOINT || '/data'
const TZ = process.env.TZ || 'Asia/Kolkata';
const ORG_ID = process.env.ORG_ID || `acme`;
const MACHINE_ID = process.env.MACHINE_ID || "m001";

console.log(`Starting simulator for API end-point at: ${BASE_URL}${API_ENDPOINT}`)

simulator.simulate({
  TZ: TZ,
  BASE_URL: BASE_URL,
  API_ENDPOINT: API_ENDPOINT,
  ORG_ID: ORG_ID,
  MACHINE_ID: MACHINE_ID
})
