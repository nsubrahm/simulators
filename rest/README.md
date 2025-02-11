# Introduction

This project is a HTTP REST client to publish valid payloads to `httpin` service.

- [Introduction](#introduction)
  - [Getting started](#getting-started)
  - [Configuration](#configuration)
  - [Running outside the network](#running-outside-the-network)

## Getting started

To launch the simulator, launch the Docker Compose file with the following command.

```bash
docker compose up -d
```

The following shows logs from the running container where `202` is the HTTP status code after the simulator has published the message. And, `Message` is the UUID of the message published to the `/data` end-point of the `payload` service. This UUID maybe used for end-to-end tracking.

```bash
Status: 202. Message: 284eb8db-3bda-4c7c-a1b5-1d70df7ab8a8
```

## Configuration

Edit the `rest.env` file with the following configuration parameters, if required.

The following parameters _maybe_ changed.

| Variable name  | Description                                                    | Default              |
| -------------- | -------------------------------------------------------------- | -------------------- |
| `FREQUENCY`    | The rate at which messages should be published in miliseconds. | `10000`              |
| `BASE_URL`     | The URL where the `httpin` service is running.                 | `http://httpin:8080` |
| `API_ENDPOINT` | The end-point where payload is to be published.                | `/data`              |

The following parameters _must not_ be changed.

| Variable name | Description                                     | Example        |
| ------------- | ----------------------------------------------- | -------------- |
| `TZ`          | The time zone where the application is running. | `Asia/Kolakta` |

## Running outside the network

The application runs in a Docker network named `mitra`. To send data from outside this network, configure the `BASE_URL` to `http://host.docker.internal:80`. For example, this simulator can be run as `docker run --name restsim --rm --env-file rest.env nsubrahm/restsim:latest`.