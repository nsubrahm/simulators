# Introduction

This project is a MQTT publisher client to publish valid payloads to a MQTT broker.

## Getting started

To launch the simulator, launch the Docker Compose file with the following command.

```bash
docker compose up -d
```

## Configuration

Edit the `mqtt.env` file with the following configuration parameters, if required.

The following parameters _maybe_ changed.

| Variable name    | Description                                                    | Default                          |
| ---------------- | -------------------------------------------------------------- | -------------------------------- |
| `FREQUENCY`      | The rate at which messages should be published in miliseconds. | `1000`                           |
| `MQTT_BROKER`    | The MQTT end-point to publishe payload.                        | `mqtt://test.mosquitto.org:1883` |
| `MQTT_CLIENT_ID` | A client identifier unique across broker.                      | `mitra001`                       |
| `MQTT_TOPIC`     | Topic where payload is published.                              | `/machines/m001/data`            |

The following parameters _must not_ be changed.

| Variable name | Description                                     | Example        |
| ------------- | ----------------------------------------------- | -------------- |
| `TZ`          | The time zone where the application is running. | `Asia/Kolakta` |
