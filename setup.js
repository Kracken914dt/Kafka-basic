const { Kafka, logLevel } = require('kafkajs');

// Configuración de Kafka
const kafka = new Kafka({
  brokers: ['localhost:9092'],
  logLevel: logLevel.INFO,
  retry: {
    initialRetryTime: 300,
    retries: 10
  }
});

// Creación del Admin
const admin = kafka.admin();

// Función para probar la conexión a Kafka y crear el tema
async function setupKafka() {
  try {
    console.log('Conectando a Kafka...');
    await admin.connect();
    console.log('Conexión exitosa a Kafka');

    // Listar los temas existentes
    const topics = await admin.listTopics();
    console.log('Temas existentes:', topics);

    // Verificar si el tema 'crypto-prices' existe
    if (!topics.includes('crypto-prices')) {
      console.log('Creando el tema crypto-prices...');
      await admin.createTopics({
        topics: [
          {
            topic: 'crypto-prices',
            numPartitions: 1,
            replicationFactor: 1
          }
        ]
      });
      console.log('Tema crypto-prices creado exitosamente');
    } else {
      console.log('El tema crypto-prices ya existe');
    }

    await admin.disconnect();
    console.log('Configuración completada');
    return true;
  } catch (error) {
    console.error('Error al configurar Kafka:', error);
    return false;
  }
}

// Ejecutar la configuración
setupKafka()
  .then(success => {
    if (success) {
      console.log('Kafka está configurado y listo para usar. Ya puedes ejecutar consumer.js y binance-ws.js');
    } else {
      console.error('No se pudo configurar Kafka. Por favor verifica que los contenedores de Docker estén en ejecución.');
    }
  })
  .catch(error => {
    console.error('Error inesperado:', error);
  }); 