# Notes

```bash
docker build -t localhost:5000/nsubrahm/ksubscriber:v0.0.0 . && docker push localhost:5000/nsubrahm/ksubscriber:v0.0.0
cd deploy
kubectl -n apps create -f deploy.yaml
docker-compose up --build
```

```bash
KAFKA_BROKER=kafka:9092
KAFKA_TOPIC=machine_alerts
```
