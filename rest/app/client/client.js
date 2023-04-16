const crypto = require("crypto")
const axios = require('axios');
const mom = require('moment-timezone')
const {
  v4: uuidv4,
} = require('uuid');

const FREQUENCY = process.env.FREQUENCY || 1000;

function generateRandomValues(options) {
  return parseFloat((crypto.randomInt(options.lo, options.hi)).toPrecision(6))
}

function buildPayload(options) {
  let msgId = uuidv4();
  let ts = mom().tz(options.TZ).format("YYYY-MM-DDTHH:mm:ss.SSS");

  let payload = {
    meta: {
      ts: ts,
      id: msgId
    },
    data: [
      { key: 'rpm', value: generateRandomValues({ lo: 1000, hi: 10000 }) },
      { key: 'temperature', value: generateRandomValues({ lo: 20, hi: 60 }) },
      { key: 'current', value: generateRandomValues({ lo: 100, hi: 1000 }) },
      { key: 'vibration', value: generateRandomValues({ lo: -10, hi: 10 }) },
      { key: 'voltage', value: generateRandomValues({ lo: 1000, hi: 10000 }) },
    ],
    alarms: [
      {
        key: "OIL_LEVEL",
        value: "LOW"
      },
      {
        key: "COOLANT_LEVEL",
        value: "LOW"
      },
    ]
  }
  return payload
}

function simulate(options) {
  let simulationInterval = setInterval(() => {
    axios.post(`${options.BASE_URL}${options.API_ENDPOINT}`, buildPayload({ TZ: options.TZ }))
      .then((response) => {
        console.log(`Status: ${response.status}. Message: ${response.data.msg}`)
      })
      .catch((error) => {
        if (error.response) {
          console.log(`Response error. Status: ${error.response.status}. Error: ${error.message}`)
          clearInterval(simulationInterval)
        } else if (error.request) {
          console.log(`Request failed. Error: ${error.message}`)
          clearInterval(simulationInterval)
        }
        console.log(`Stopped simulation.`)
      })
  }, FREQUENCY)
}

module.exports = {
  simulate: simulate
}