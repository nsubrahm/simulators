// Import the mqtt package
const mqtt = require('mqtt');
const crypto = require("crypto");

class MqttPublisher {
  constructor(options) {
    this.brokerUrl = options.MQTT_BROKER;
    this.topic = options.MQTT_TOPIC;
    this.client = mqtt.connect(this.brokerUrl, { clientId: options.clientId, protocolVersion: 5, clean: true });

    // Handle connection
    this.client.on('connect', () => {
      console.log(`Connected to MQTT broker at ${this.brokerUrl}`);

      // Set up subscription to replies
      const replyTopic = `${this.topic}/replies`;
      this.client.subscribe(replyTopic, { qos: 2 }, (err) => {
        if (err) {
          reject(`Failed to subscribe to ${replyTopic}: ${err.message}`);
        } else {
          console.log(`Subscribed to ${replyTopic}`);
          resolve(`Subscribed to ${replyTopic}`);
        }
      });
    });

    // Handle errors
    this.client.on('error', (err) => {
      console.error(`MQTT error: ${err.message}`);
      this.client.end();
    });
  }

  // Publish a message to the topic
  async publishMessageAsync(message) {
    return new Promise((resolve, reject) => {
      if (this.client.connected) {
        this.client.publish(this.topic, message, {
          qos: 2,
          properties: {
            responseTopic: `${this.topic}/replies`,
            correlationData: Buffer.from(crypto.randomBytes(4).toString('hex'))
          }
        }, (err) => {
          if (err) {
            reject(`Error publishing message: ${err.message}`);
          } else {
            resolve(`Message "${message}" published to topic "${this.topic}"`);
          }
        });
      } else {
        reject('MQTT client not connected');
      }
    });
  }

  // Subscribe to replies and handle incoming messages
  async subscribeToRepliesAsync() {
    return new Promise((resolve, reject) => {
      if (this.client.connected) {
        this.client.on('message', (topic, message, packet) => {
          if (topic === replyTopic) {
            const correlationData = packet.properties?.correlationData?.toString('hex') || 'none';
            console.log(`Reply: ${message.toString()} (correlationData: ${correlationData})`);
            resolve()
          }
        });
      } else {
        reject('MQTT client not connected');
      }
    });
  }

  // Gracefully end the connection
  async endConnection() {
    this.client.end(() => {
      console.log('MQTT client disconnected');
    });
  }
}

module.exports = MqttPublisher;
