// Import the mqtt package
const mqtt = require('mqtt');

class MqttPublisher {
  constructor(options) {
    this.brokerUrl = options.MQTT_BROKER;
    this.topic = options.MQTT_TOPIC;
    this.client = mqtt.connect(this.brokerUrl, options);

    // Handle connection
    this.client.on('connect', () => {
      console.log(`Connected to MQTT broker at ${this.brokerUrl}`);
    });

    // Handle errors
    this.client.on('error', (err) => {
      console.error(`MQTT Error: ${err.message}`);
      this.client.end();
    });
  }

  // Publish a message to the topic
  async publishMessageAsync(message, options = {}) {
    return new Promise((resolve, reject) => {
      if (this.client.connected) {
        this.client.publish(this.topic, message, options, (err) => {
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

  // Gracefully end the connection
  async endConnection() {
    this.client.end(() => {
      console.log('MQTT client disconnected');
    });
  }
}

module.exports = MqttPublisher;
