const WebSocket = require('ws');
const sendToKafka = require('./producer');

console.log('Iniciando conexión WebSocket con Binance...');

const socket = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade');

socket.on('open', () => {
  console.log('Conexión WebSocket establecida con Binance');
});

socket.on('message', async (data) => {
  try {
    const parsed = JSON.parse(data);
    const priceInfo = {
      symbol: parsed.s,
      price: parsed.p,
      time: new Date(parsed.T).toLocaleTimeString()
    };
    console.log('Enviando a Kafka:', priceInfo);
    await sendToKafka(priceInfo);
  } catch (error) {
    console.error('Error al procesar mensaje de Binance:', error);
  }
});

socket.on('error', (error) => {
  console.error('Error en la conexión WebSocket:', error);
});

socket.on('close', () => {
  console.log('Conexión WebSocket cerrada');
});

// Manejar la finalización del proceso
process.on('SIGINT', () => {
  console.log('Cerrando conexión WebSocket...');
  socket.close();
  process.exit(0);
});
