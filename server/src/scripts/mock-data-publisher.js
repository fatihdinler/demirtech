const mqtt = require('mqtt');

// MQTT broker URL'nizi buraya girin. Örneğin, "mqtt://localhost" veya farklı bir broker.
const client = mqtt.connect('mqtt://broker.emqx.io', { username: 'emqx', password: 'password' })

// Yayınlanacak topicler
const topics = [
  'demirtech/5048110/temperature',
  'demirtech/5048110/humidity',
  'demirtech/5048111/temperature',
  'demirtech/5048112/humidity'
];

// 20 ile 50 arasında rastgele ondalıklı değer üretir (2 basamaklı)
function getRandomValue() {
  return parseFloat((20 + Math.random() * 30).toFixed(2));
}

client.on('connect', () => {
  console.log('MQTT broker\'a bağlanıldı.');

  // Her saniye tüm topic'lere mesaj gönder
  setInterval(() => {
    topics.forEach(topic => {
      // Topic formatı: "demirtech/{chipId}/{type}"
      const parts = topic.split('/');
      const chipId = parseInt(parts[1]);
      const type = parts[2];

      // Mesaj objesi
      const message = {
        value: getRandomValue(),
        type: type,
        chipId: chipId
      }

      const payload = JSON.stringify(message)

      client.publish(topic, payload, (err) => {
        if (err) {
          console.error(`Error publishing to ${topic}:`, err)
        } else {
          console.log(`Published to ${topic}: ${payload}`)
        }
      })
    })
  }, 5000)
})

client.on('error', (err) => {
  console.error('MQTT connection error:', err);
  client.end();
});
