const crypto = require("crypto")
const { Kafka } = require('kafkajs')
const mom = require('moment-timezone')

const {
  v4: uuidv4,
} = require('uuid');

const FREQUENCY = process.env.FREQUENCY || 1000
const TZ = process.env.TZ || "Asia/Kolakta"
const SASL_USERNAME = process.env.SASL_USERNAME
const SASL_PASSWORD = process.env.SASL_PASSWORD

const kafka = new Kafka({
  clientId: 'kpub',
  brokers: [process.env.KAFKA_BROKER],
  sasl: {
    mechanism: 'plain',
    username: SASL_USERNAME,
    password: SASL_PASSWORD
  },
})

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

const producer = kafka.producer()

const run = async () => {
  await producer.connect()

  setInterval(async function () {
    let msgId = uuidv4();
    let ts = mom().tz(TZ).format("YYYY-MM-DDTHH:mm:ss.SSS");

    let payload = buildPayload({ TZ: TZ })
    await producer.send({
      topic: process.env.KAFKA_TOPIC,
      messages: [
        {
          key: payload.meta.id,
          value: JSON.stringify(payload)
        }
      ],
    })
    console.log(`Message published - ${msgId} at ${ts}`)
  }, FREQUENCY)
}

run().catch(e => console.error(` ${e.message}`, e))
