const crypto = require("crypto")
const axios = require('axios');
const mom = require('moment-timezone')
const {
  v4: uuidv4,
} = require('uuid');

const FREQUENCY = process.env.FREQUENCY || 1000;

const ranges = {
  spindleLoad: { lo: 0, hi: 50 },
  spindleTemperature: { lo: 1, hi: 150 },
  spindleSpeed: { lo: 0, hi: 20000 }
}

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
      { key: 'spindleLoad', value: generateRandomValues({ lo: ranges.spindleLoad.lo, hi: ranges.spindleLoad.hi }) },
      { key: 'spindleTemperature', value: generateRandomValues({ lo: ranges.spindleTemperature.lo, hi: ranges.spindleTemperature.hi }) },
      { key: 'spindleSpeed', value: generateRandomValues({ lo: ranges.spindleSpeed.lo, hi: ranges.spindleSpeed.hi }) },
    ],
    alarms: [
      { key: "COOLANT_LEVEL", value: "LOW" },
      { key: "LUBRICANT_LEVEL", value: "FULL" },
      { key: "OIL_PRESSURE", value: "OK" }
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
          console.log(error.response);
          console.log(`Response error. Status: ${error.response.status}. Error: ${error.response.data.msg}`);
          clearInterval(simulationInterval);
        } else if (error.request) {
          console.log(`Request failed. Error: ${error.message}`);
          clearInterval(simulationInterval);
        }
        console.log(`Stopped simulation.`);
      });
  }, FREQUENCY);
}

module.exports = {
  simulate: simulate
}