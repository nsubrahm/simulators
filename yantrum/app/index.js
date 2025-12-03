const simulator = require('./client/client')

const BASE_URL = process.env.BASE_URL || 'https://monitor.yantrayam.in/api/payload'
const API_ENDPOINT = process.env.API_ENDPOINT || 'data'
const TZ = process.env.TZ || 'Asia/Kolkata';
const ORG_ID = process.env.ORG_ID || `acme`;
const MACHINE_ID = process.env.MACHINE_ID || "m001";
const FREQUENCY = process.env.FREQUENCY || 1000;

let payloadUrl = `${BASE_URL}/${API_ENDPOINT}`
console.log(`Starting simulator for ${payloadUrl} at ${FREQUENCY} ms frequency.`)

simulator.simulate({
  PAYLOAD_URL: payloadUrl,
  TZ: TZ,
  ORG_ID: ORG_ID,
  MACHINE_ID: MACHINE_ID,
  FREQUENCY: FREQUENCY
})
