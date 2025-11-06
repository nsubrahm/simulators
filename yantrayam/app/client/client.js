const crypto = require("crypto")
const axios = require('axios');
const mom = require('moment-timezone')
const {
  v4: uuidv4,
} = require('uuid');

 const ranges = {
  current1: { lo: 1, hi: 50 },
  current2: { lo: 1, hi: 50 },
  current3: { lo: 1, hi: 50 },
  voltage1: { lo: 1, hi: 30 },
  voltage2: { lo: 1, hi: 30 },
  voltage3: { lo: 1, hi: 30 },
  pf1: { lo: 0, hi: 1},
  pf2: { lo: 0, hi: 1},
  pf3: { lo: 0, hi: 1}
}

function generatePartcount(TZ) {
  // Use current timestamp in the specified TZ as startTime
  const startTime = mom().tz(TZ).startOf('minute'); // rounded to minute
  const now = mom().tz(TZ);
  const elapsedMinutes = now.diff(startTime, 'minutes');
  return Math.floor(elapsedMinutes / 2) + 1;
}

function generateMachineStatus() {
  // STATUS cycles: RUN (20 mins), IDLE (8 mins), OFF (2 mins) in a 30-minute loop
  const now = new Date();
  const minutesSinceEpoch = Math.floor(now.getTime() / (1000 * 60));
  const cyclePosition = minutesSinceEpoch % 30;

  if (cyclePosition < 20) return "RUN";
  if (cyclePosition < 28) return "IDLE";
  return "OFF";
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
  { key: 'partCount', value: generatePartcount(options.TZ) },
  { key: 'current1', value: generateRandomValues(ranges.current1) },
  { key: 'current2', value: generateRandomValues(ranges.current2) },
  { key: 'current3', value: generateRandomValues(ranges.current3) },
  { key: 'voltage1', value: generateRandomValues(ranges.voltage1) },
  { key: 'voltage2', value: generateRandomValues(ranges.voltage2) },
  { key: 'voltage3', value: generateRandomValues(ranges.voltage3) },
  { key: 'pf1', value: generateRandomValues(ranges.pf1) },
  { key: 'pf2', value: generateRandomValues(ranges.pf2) },
  { key: 'pf3', value: generateRandomValues(ranges.pf3) },
],
    alarms: [
      { key: 'STATUS', value: generateMachineStatus() },
      { key: "COOLANT_LEVEL", value: ["LOW", "NORMAL", "HIGH"][Math.floor(Math.random() * 3)] },
      { key: "OIL_LEVEL", value: ["LOW", "NORMAL", "HIGH"][Math.floor(Math.random() * 3)] }
    ]
  }
  return payload
}

function simulate(options) {
  let payloadUrl = `${options.BASE_URL}${options.API_ENDPOINT}?orgId=${options.ORG_ID}&machineId=${options.MACHINE_ID}`;
  let simulationInterval = setInterval(() => {
    let payload = buildPayload({ TZ: options.TZ });
    axios.post(payloadUrl, payload)
      .then((response) => {
        console.log(`Status: ${response.status}. Message: ${response.data.msg}`)
      })
      .catch((error) => {
        if (error.response) {
          console.log(`Response error. Status: ${error.response.status}. Error: ${error.response.data.msg}`);
          clearInterval(simulationInterval);
        } else if (error.request) {
          console.log(`Request failed. Error: ${error.message}`);
          clearInterval(simulationInterval);
        }
        console.log(`Stopped simulation.`);
      });
  }, options.FREQUENCY);
}

module.exports = {
  simulate: simulate
}