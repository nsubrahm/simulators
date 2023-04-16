const { Kafka } = require('kafkajs')

const SASL_USERNAME = process.env.SASL_USERNAME
const SASL_PASSWORD = process.env.SASL_PASSWORD

const kafka = new Kafka({
  clientId: 'ksub',
  brokers: [process.env.KAFKA_BROKER],
  sasl: {
    mechanism: 'plain',
    username: SASL_USERNAME,
    password: SASL_PASSWORD
  },
})

const consumer = kafka.consumer({ groupId: 'ksub' })

const run = async () => {
  await consumer.connect()
  await consumer.subscribe({ topic: process.env.KAFKA_TOPIC, fromBeginning: true })

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        key: message.key.toString(),
        value: message.value.toString(),
      })
    },
  })
}

run().catch(e => console.error(` ${e.message}`, e))