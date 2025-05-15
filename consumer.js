const { Kafka } = require('kafkajs');

const kafka = new Kafka({ 
  brokers: ['localhost:9092'],
  retry: {
    initialRetryTime: 300,
    retries: 10
  }
});

const consumer = kafka.consumer({ groupId: 'crypto-group' });

async function startConsumer() {
  try {
    console.log('Conectando al consumidor de Kafka...');
    await consumer.connect();
    console.log('Consumidor conectado correctamente');
    
    console.log('Suscribiendo al tema crypto-prices...');
    await consumer.subscribe({ topic: 'crypto-prices', fromBeginning: false });
    console.log('Suscripción exitosa');

    await consumer.run({
      eachMessage: async ({ message }) => {
        const value = JSON.parse(message.value.toString());
        console.log('Recibido desde Kafka:', value);
      },
    });
  } catch (error) {
    console.error('Error en el consumidor de Kafka:', error);
  }
}

startConsumer().catch(console.error);

// Manejar la finalización del proceso
const errorTypes = ['unhandledRejection', 'uncaughtException'];
const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2'];

errorTypes.forEach(type => {
  process.on(type, async () => {
    try {
      console.log(`Proceso terminado por ${type}`);
      await consumer.disconnect();
      process.exit(0);
    } catch (_) {
      process.exit(1);
    }
  });
});

signalTraps.forEach(type => {
  process.once(type, async () => {
    try {
      await consumer.disconnect();
    } finally {
      process.kill(process.pid, type);
    }
  });
});