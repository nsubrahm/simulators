# Introduction

This project is a Kafka subscription client to subscribe messages from a given topic string.

- [Introduction](#introduction)
  - [Getting started](#getting-started)
  - [Configuration](#configuration)
    - [Kafka publisher](#kafka-publisher)
    - [Kafka authentication](#kafka-authentication)

## Getting started

1. Configure the environment variables in `kpub.env` as described in the [Configuration](#configuration) section.
2. To launch the simulator, launch the Docker Compose file with the following command.

```bash
docker compose up -d
```

The following shows messages from the running container.

```bash
Message published - 29e7e8b6-d2bf-450f-acc6-40684934ab4b at 2023-04-16T21:06:53.983.
```

## Configuration

There are two sets of configuration parameters to be updated in two separate files `ksub.env` and `sasl-auth.env` for configuring Kafka subscriber and SASL authentication.

### Kafka publisher

The following parameters _must be_ changed.

| Variable name  | Description                                  | Example        |
| -------------- | -------------------------------------------- | -------------- |
| `KAFKA_BROKER` | Host and port of Kafka broker to connect to. | `broker:29093` |
| `KAFKA_TOPIC`  | Topic string to publish.                     | `m002_data`    |

The following parameters _must not_ be changed.

| Variable name | Description                                     | Example        |
| ------------- | ----------------------------------------------- | -------------- |
| `TZ`          | The time zone where the application is running. | `Asia/Kolakta` |

### Kafka authentication

The following parameters _must be_ changed.

| Variable name   | Description                                              | Example       |
| --------------- | -------------------------------------------------------- | ------------- |
| `SASL_USERNAME` | User name for SASL authentication                        | `alice`       |
| `SASL_PASSWORD` | Password for the user configured for SASL authentication | `alicesecret` |
