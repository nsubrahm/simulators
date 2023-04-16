# Introduction

This application validates payload received at a HTTP end-point for downstream transmission.

- [Introduction](#introduction)
  - [Overview](#overview)
  - [Rate limiting](#rate-limiting)
    - [Headers - within rate limit](#headers---within-rate-limit)
    - [Headers - exceeded rate limit](#headers---exceeded-rate-limit)
  - [Build and deploy](#build-and-deploy)
  - [Configuration](#configuration)
  - [Raw data](#raw-data)

## Overview

This application exposes a `/data` end-point to which machine data is published as a JSON payload with a `POST` request. If the payload is valid, then a `202` status message is returned. This indicates that the message is valid and has been published to Kafka for downstream consumption. Else, a `400` message is published to indicate the payload is invalid.

> This application limits upto `28,800` requests in a time window of `8 hours` at one go.

## Rate limiting

This application implements rate-limiting such that, a maximum of `28,800` requests can be sent in a time window of `8 hours` - whichever is earlier. For example, if a machine publishes data every second, then the machine can keep publishing continuously upto a maximum of `28,800` requests (`8*3600=28800`) for upto `8 hours`. The rate limit is applied even if the number of requests exceed `28,800` _within_ the time window of `8 hours`.

When the rate limit is reached, a response with HTTP status code `429` will be sent with the following payload and additional headers. See following sections for additional headers.

```json
{
  "statusCode": 429,
  "error": "Too Many Requests",
  "message": "Rate limit exceeded, retry in 1 minute"
}
```

Every response will have additional headers to indicate rate limiting.

### Headers - within rate limit

The following headers are sent when the requests are **within** rate limit.

### Headers - exceeded rate limit

The following headers are sent when the requests have **exceeded** rate limit.


## Build and deploy

The GitHub Actions configured in [`publish.yaml`](.github/workflows/publish.yaml) will build the container image using distroless base image and deploy to GHCR when a push is done to the appropriate branch.

## Configuration

The following configuration properties are set in an `.env` file. These configuration properties must be edited for every deployment.

```env
# Must change
MACHINE_DATA_TOPIC=m001_data
# May change
GRACE_TIME=10000
# Do not change
KAFKA_BROKER=broker:9092
APP_ID=M001
TZ="Asia/Kolkata"
PORT=8080
FREQUENCY=5000
INITIAL_DELAY=10000
```

| Variable name        | Description                                                                                              | Example                                |
| -------------------- | -------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| `MACHINE_DATA_TOPIC` | A Kafka topic to which validated messages will be published to.                                          | `m001_data`                            |
| `GRACE_TIME`         | Accept payloads with a timestamp that is in the range of current timestamp ± `GRACE_TIME` milli-seconds. | `10000` (default) for 10 seconds, etc. |

The following variables should not be changed.

| Variable name   | Description                                  | Example        |
| --------------- | -------------------------------------------- | -------------- |
| `KAFKA_BROKER`  | URL of Kafka broker                          | `broker:9092`  |
| `APP_ID`        | Application ID for the Kafka publisher       | `M001`         |
| `TZ`            | Time zone for time calculations              | `Asia/Kolkata` |
| `PORT`          | End-point port number                        | `8080`         |
| `FREQUENCY`     | Frequency (ms) to poll for health            | `5000`         |
| `INITIAL_DELAY` | Initial (ms) delay before polling for health | `10000`        |

## Raw data

The following JSON payload is an example of valid payload.

```json
{
  "meta": {
    "id": "8c3aacea-7bf5-4f91-a767-7ad1083a5958",
    "ts": "2022-10-01T21:00:00.400"
  },
  "data": [
    {
      "key": "rpm",
      "value": 1000
    },
    {
      "key": "temperature",
      "value": 1000
    }
  ],
  "alarms": [
    {
      "key": "OIL_LEVEL",
      "value": "FULL"
    },
    {
      "key": "COOLANT_TEMP",
      "value": "HIGH"
    }
  ]
}
```

1. Each message will have three keys - `meta`, `data` and `alarms` where, `meta` and `data` are mandatory and `alarms` is optional.
2. The `meta` object _must_ have the keys `ts` and `id` for timestamp and message ID respectively. This message ID _must_ be a UUID. The timestamp _must_ be in the `YYYY-MM-DDTHH:mm:ss.SSS` and should be within a window of `GRACE_TIME` milliseconds.
3. The `data` object is an array of objects where each object has two keys - `key` and `value`. The `key` is set to parameter name and `value` is set to numeric (real number) values.
4. The `alarms` object is an array of objects where each object has two keys - `key` and `value`. The `key` is set to parameter name and `value` is set to alphanumeric values.
