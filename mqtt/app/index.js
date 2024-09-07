const simulator = require('./client/client')
const randomString = require('randomString')

const MQTT_BROKER = process.env.MQTT_BROKER || 'mqtt://test.mosquitto.org:1883'
const MQTT_CLIENT_ID = process.env.MQTT_CLIENT_ID || randomString.generate({ length: 12, charset: 'alphabetic' });
const MQTT_TOPIC = process.env.MQTT_TOPIC || '/machines/m001/data'
const FREQUENCY = process.env.FREQUENCY || 1000;
const TZ = process.env.TZ || 'Asia/Kolkata';

console.log(`Starting simulator for MQTT broker at: ${MQTT_BROKER}`)

simulator.simulate({
  TZ: TZ,
  FREQUENCY: FREQUENCY,
  MQTT: {
    MQTT_BROKER: MQTT_BROKER,
    MQTT_CLIENT_ID: MQTT_CLIENT_ID,
    MQTT_TOPIC: MQTT_TOPIC
  }
})
