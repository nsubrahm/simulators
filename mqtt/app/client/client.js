const crypto = require("crypto")
const mqttPub = require("./mqtt")

const mom = require('moment-timezone')
const {
  v4: uuidv4,
} = require('uuid');

const LO_FACTOR = 0.1;
const HI_FACTOR = 10;

const safeRanges = {
  spindleLoad: { lo: 0, hi: 10 },
  spindleTemperature: { lo: 10, hi: 70 },
  spindleSpeed: { lo: 0, hi: 8000 }
}

function generateRandomValues(options) {
  return parseFloat((crypto.randomInt(options.lo, options.hi)).toPrecision(6))
}

function connectMqtt(options) {
  const mqttClient = new mqttPub(options);
  return mqttClient
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
      { key: 'spindleLoad', value: generateRandomValues({ lo: LO_FACTOR * safeRanges.spindleLoad.lo, hi: HI_FACTOR * safeRanges.spindleLoad.hi }) },
      { key: 'spindleTemperature', value: generateRandomValues({ lo: LO_FACTOR * safeRanges.spindleTemperature.lo, hi: HI_FACTOR * safeRanges.spindleTemperature.hi }) },
      { key: 'spindleSpeed', value: generateRandomValues({ lo: LO_FACTOR * safeRanges.spindleSpeed.lo, hi: HI_FACTOR * safeRanges.spindleSpeed.hi }) },
    ]
  }
  return payload
}

function simulate(options) {
  const mqttClient = connectMqtt(options.MQTT)
  let simulationInterval = setInterval(async () => {
    try {
      // Publish a message asynchronously
      let payload = JSON.stringify(buildPayload({TZ: options.TZ}));
      await mqttClient.publishMessageAsync(payload);
    } catch (error) {
      console.log(`MQTT publication error: ${error}`)
      clearInterval(simulationInterval)
      await mqttClient.endConnection();
    }
  }, options.FREQUENCY)
}

module.exports = {
  simulate: simulate
}