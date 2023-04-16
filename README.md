# Introduction

This project has simulators to test publication and subscription of payloads.

## Getting started

The following simulators can be used.

1. [HTTP REST client](./rest/README.md) - simulates a device publishing payloads via HTTP to the `cleaner` service.
2. [Kafka publisher](./kpub/README.md) - simulates a device publishing payloads as a Kafka publisher client to `cleaner` service.
3. [Kafka subscriber](./ksub/README.md) - reads message and displays on console from a configurable topic string.
