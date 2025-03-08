// mqtt-publish-simulator.js
const mqtt = require('mqtt');

// MQTT broker URL'inizi ayarlayın (örneğin, localhost için 'mqtt://localhost')
const client = mqtt.connect('mqtt://broker.emqx.io');

client.on('connect', () => {
  console.log('Connected to MQTT broker');

  // 5000000'den başlayarak 10 adet chipId oluşturuyoruz.
  const devices = [];
  for (let i = 0; i < 10; i++) {
    devices.push(5000000 + i);
  }

  // Her saniyede bir, tüm cihazlar için mesaj yayınlayacak fonksiyon
  const publishMessages = () => {
    devices.forEach(chipId => {
      const possibleTypes = ['current', 'humidity'];
      const type = possibleTypes[Math.floor(Math.random() * possibleTypes.length)];
      // Örnek olarak 0-100 arasında iki ondalık basamaklı rastgele bir değer üretiyoruz.
      const value = (Math.random() * 100).toFixed(2);

      // Topic: demirtech/<chipId>/<type>
      const topic = `demirtech/${chipId}/${type}`;
      // Mesaj JSON formatında
      const message = JSON.stringify({
        chipId: chipId.toString(),
        value: value,
        type: type,
      });

      client.publish(topic, message, { qos: 0 }, (err) => {
        if (err) {
          console.error(`Error publishing to ${topic}:`, err);
        } else {
          console.log(`Published to ${topic}: ${message}`);
        }
      });
    });
  };

  // Her 1 saniyede bir publishMessages fonksiyonunu çalıştır
  setInterval(publishMessages, 1000);
});
