const { Kafka } = require('kafkajs');

const kafka = new Kafka({ 
  brokers: ['localhost:9092'],
  retry: {
    initialRetryTime: 300,
    retries: 10
  }
});

const producer = kafka.producer();

async function sendToKafka(data) {
  try {
    await producer.connect();
    console.log('Productor conectado correctamente');
    
    await producer.send({
      topic: 'crypto-prices',
      messages: [{ value: JSON.stringify(data) }],
    });
    console.log('Mensaje enviado a Kafka:', data);
    
    await producer.disconnect();
  } catch (error) {
    console.error('Error al enviar mensaje a Kafka:', error);
  }
}

// Inicializar el productor
async function initProducer() {
  try {
    console.log('Conectando al productor de Kafka...');
    await producer.connect();
    console.log('Productor inicializado correctamente');
    await producer.disconnect();
  } catch (error) {
    console.error('Error al inicializar el productor de Kafka:', error);
  }
}

// Inicializar el productor al importar el módulo
initProducer().catch(console.error);

module.exports = sendToKafka;
