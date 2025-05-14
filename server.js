const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const { Kafka } = require('kafkajs');

// Configuración del servidor Express
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de Kafka
const kafka = new Kafka({
  brokers: ['localhost:9092'],
  retry: {
    initialRetryTime: 300,
    retries: 10
  }
});

// Variables para almacenar datos históricos
const priceHistory = [];
const MAX_HISTORY = 50; // Mantener solo los últimos 50 puntos de datos

// Función para iniciar el consumidor de Kafka
async function startKafkaConsumer() {
  try {
    const consumer = kafka.consumer({ groupId: 'visualization-group' });
    
    console.log('Conectando al consumidor de Kafka...');
    await consumer.connect();
    console.log('Consumidor conectado correctamente');
    
    console.log('Suscribiendo al tema crypto-prices...');
    await consumer.subscribe({ topic: 'crypto-prices', fromBeginning: false });
    console.log('Suscripción exitosa');

    // Contador para simular el estado de la cola
    let queueSize = 0;

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        // Simular la cola aumentando temporalmente su tamaño
        queueSize++;
        
        // Procesar el mensaje
        const value = JSON.parse(message.value.toString());
        console.log('Recibido desde Kafka:', value);
        
        // Añadir timestamp para la visualización
        value.timestamp = new Date().toISOString();
        
        // Guardar en historial
        priceHistory.push(value);
        if (priceHistory.length > MAX_HISTORY) {
          priceHistory.shift(); // Eliminar el más antiguo
        }
        
        // Emitir datos a todos los clientes conectados
        io.emit('price-update', { 
          price: value,
          queueStatus: {
            size: queueSize,
            topic: topic,
            partition: partition
          },
          history: priceHistory
        });
        
        // Simular procesamiento de mensaje y reducción de la cola
        setTimeout(() => {
          queueSize = Math.max(0, queueSize - 1); // Asegurar que no sea negativo
          io.emit('queue-update', { size: queueSize });
        }, 1000);
      },
    });
  } catch (error) {
    console.error('Error en el consumidor de Kafka:', error);
  }
}

// Manejar conexiones de Socket.IO
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');
  
  // Enviar datos históricos al nuevo cliente
  socket.emit('historical-data', priceHistory);
  
  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
  // Iniciar el consumidor de Kafka
  startKafkaConsumer().catch(console.error);
}); 