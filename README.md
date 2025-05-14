# Aplicación Kafka con NodeJS

Esta aplicación utiliza Kafka para procesar datos de criptomonedas desde Binance.

## Requisitos

- Docker y Docker Compose
- Node.js

## Instalación

1. Instalar dependencias:

```bash
npm install
```

## Iniciar Kafka

1. Inicia Kafka y Zookeeper con Docker Compose:

```bash
docker-compose up -d
```

2. Verifica que los contenedores estén funcionando:

```bash
docker-compose ps
```

3. Configura Kafka y verifica la conexión:

```bash
node setup.js
```

## Ejecutar la aplicación

1. En una terminal, inicia el consumidor:

```bash
node consumer.js
```

2. En otra terminal, inicia el productor que se conecta a Binance:

```bash
node binance-ws.js
```

## Solución de problemas

- Si ves errores de conexión a Kafka, asegúrate de que los contenedores de Docker estén funcionando correctamente.
- Puedes revisar los logs de Kafka con: `docker logs kafka`
- Puedes revisar los logs de Zookeeper con: `docker logs zookeeper`
- Si los contenedores están funcionando pero aún hay errores de conexión, espera unos minutos hasta que Kafka se inicialice completamente.
- Asegúrate de ejecutar `node setup.js` antes de iniciar el consumidor y el productor.

## Detener servicios

Para detener los servicios de Kafka y Zookeeper:

```bash
docker-compose down
``` 