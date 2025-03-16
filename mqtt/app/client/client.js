const crypto = require("crypto")
const mqttPub = require("./mqttPub")
const mom = require('moment-timezone')
const {
  v4: uuidv4,
} = require('uuid');

const FREQUENCY = process.env.FREQUENCY || 1000;

const ranges = {
  spindleLoad: { lo: 0, hi: 50 },
  spindleTemperature: { lo: 1, hi: 150 },
  spindleSpeed: { lo: 0, hi: 20000 },
  spindleMotorVoltage: { lo: 10, hi: 25 },
  spindleMotorCurrent: { lo: 2, hi: 8 }
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
      { key: 'spindleLoad', value: generateRandomValues({ lo: ranges.spindleLoad.lo, hi: ranges.spindleLoad.hi }) },
      { key: 'spindleTemperature', value: generateRandomValues({ lo: ranges.spindleTemperature.lo, hi: ranges.spindleTemperature.hi }) },
      { key: 'spindleSpeed', value: generateRandomValues({ lo: ranges.spindleSpeed.lo, hi: ranges.spindleSpeed.hi }) },
      { key: 'spindleMotorVoltage', value: generateRandomValues({ lo: ranges.spindleMotorVoltage.lo, hi: ranges.spindleMotorVoltage.hi }) },
      { key: 'spindleMotorCurrent', value: generateRandomValues({ lo: ranges.spindleMotorCurrent.lo, hi: ranges.spindleMotorCurrent.hi }) }
    ],
    alarms: [
      { key: "COOLANT_LEVEL", value: ["LOW", "NORMAL", "HIGH"][Math.floor(Math.random() * 3)] },
      { key: "OIL_LEVEL", value: ["LOW", "NORMAL", "HIGH"][Math.floor(Math.random() * 3)] },
      { key: "POWER_STATUS", value: ["ON", "OFF", "STANDBY"][Math.floor(Math.random() * 3)] },
      { key: "EMERGENCY_STOP", value: ["ACTIVE", "INACTIVE"][Math.floor(Math.random() * 2)] },
      { key: "TOOL_WEAR", value: ["NORMAL", "WARN", "CRITICAL"][Math.floor(Math.random() * 3)] }
    ]
  }
  return payload
}

function simulate(options) {
  const mqttClient = connectMqtt(options.MQTT)
  let simulationInterval = setInterval(async () => {
    try {
      // Publish a message asynchronously
      let payload = JSON.stringify(buildPayload({ TZ: options.TZ }));
      await mqttClient.publishMessageAsync(payload);
      console.log(`Message published: ${payload.meta.id}`);
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