# Aplicación Kafka con NodeJS y React

Esta aplicación utiliza Kafka para procesar datos de criptomonedas desde Binance y visualizarlos en tiempo real con React.

## Estructura del Proyecto

- `server.js`: Servidor Express + WebSocket + Consumidor de Kafka
- `consumer.js`: consumidor otro extra
- `binance-ws.js`: Cliente WebSocket que se conecta a Binance y envía datos a Kafka
- `producer.js`: Productor de Kafka que recibe datos de Binance
- `setup.js`: Script para configurar el tema de Kafka
- `client/`: Aplicación React con Vite y Tailwind CSS para visualizar los datos

## Requisitos

- Docker y Docker Compose
- Node.js

## Instalación

1. Instalar dependencias del servidor:

```bash
npm install
```

2. Instalar dependencias del cliente React:

```bash
cd client
npm install
cd ..
```

## Iniciar Kafka

1. Inicia el broker Redpanda (compatible con Kafka) con Docker Compose:

```bash
docker-compose up -d
```

2. Verifica que el contenedor esté funcionando:

```bash
docker-compose ps
```

3. Configura Kafka y verifica la conexión:

```bash
node setup.js
```

## Ejecutar la aplicación

1. Inicia el servidor de WebSocket/Kafka (en una terminal):

```bash
node server.js
```

2. En otra terminal, inicia el productor que se conecta a Binance:

```bash
node binance-ws.js
```

3. En una tercera terminal, inicia la aplicación de React:

```bash
cd client
npm run dev
```

4. Abre tu navegador en `http://localhost:5173` para ver la visualización en tiempo real.

## Visualización

La aplicación permite ver:

- Una representación visual del sistema de colas Kafka
- El precio actual de BTC/USDT con indicadores de subida/bajada
- Un gráfico en tiempo real de la evolución del precio

## Solución de problemas

- Si ves errores de conexión a Kafka, asegúrate de que los contenedores de Docker estén funcionando correctamente.
- Puedes revisar los logs de Redpanda con: `docker logs redpanda`
- Si los contenedores están funcionando pero aún hay errores de conexión, espera unos minutos hasta que Kafka se inicialice completamente.
- Si el cliente React no se conecta al servidor, verifica que el servidor esté ejecutándose en el puerto 3000.

## Detener servicios

Para detener los servicios:

1. Detén la aplicación React con Ctrl+C
2. Detén el servidor con Ctrl+C
3. Detén binance-ws.js con Ctrl+C
4. Detén los contenedores de Docker:

```bash
docker-compose down
``` 