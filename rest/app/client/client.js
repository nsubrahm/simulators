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
      id: msgId,
      type: "data"
    },
    data: [
      { key: 'spindleLoad', value: generateRandomValues({ lo: 100, hi: 10000 }) },
      { key: 'spindleTemperature', value: generateRandomValues({ lo: 10, hi: 100 }) },
      { key: 'spindleSpeed', value: generateRandomValues({ lo: 100, hi: 1000 }) },
    ],
    alarms: []
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