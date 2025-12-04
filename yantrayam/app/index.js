const simulator = require('./client/client')

const PROTOCOL = process.env.PROTOCOL || 'https'
const BASE_URL = process.env.BASE_URL || 'apis.yantrayam.in'
const API_ENDPOINT = process.env.API_ENDPOINT || 'data'
const TZ = process.env.TZ || 'Asia/Kolkata';
const ORG_ID = process.env.ORG_ID || `acme`;
const MACHINE_ID = process.env.MACHINE_ID || "m001";
const FREQUENCY = process.env.FREQUENCY || 1000;
const SIMULATOR_ENV = process.env.SIMULATOR_ENV || 'prod';

let payloadUrl = ''
if (SIMULATOR_ENV === 'prod') {
  payloadUrl = `${PROTOCOL}://${ORG_ID}.${BASE_URL}/${API_ENDPOINT}/${MACHINE_ID}`
} else if (SIMULATOR_ENV === 'dev') {
  payloadUrl = `http://localhost:8080/data/${MACHINE_ID}`
} else {
  console.log(`Invalid simulation environment - ${SIMULATOR_ENV}`)
  process.exit(1)
}

simulator.simulate({
  PAYLOAD_URL: payloadUrl,
  TZ: TZ,
  FREQUENCY: FREQUENCY
})
