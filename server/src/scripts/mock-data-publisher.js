const mqtt = require('mqtt');

// MQTT broker adresi (örneğin localhost)
const client = mqtt.connect('mqtt://broker.emqx.io', { username: 'emqx', password: 'password' })

// 10 adet cihaz oluşturuluyor
const devices = [];
for (let i = 0; i < 10; i++) {
  // 7 haneli rastgele chipId üretimi (1000000 - 9999999)
  const chipId = Math.floor(1000000 + Math.random() * 9000000).toString();
  // "temperature" veya "humidity" rastgele seçiliyor
  const type = Math.random() < 0.5 ? 'temperature' : 'humidity';
  devices.push({ chipId, type });
}

client.on('connect', () => {
  console.log('MQTT broker\'a bağlanıldı.');

  // Her saniye tüm cihazlar için yeni mesaj gönderimi
  setInterval(() => {
    devices.forEach(device => {
      // Cihaz tipine göre yeni random value üretimi:
      // temperature için: 15 - 30 arası, humidity için: 30 - 80 arası
      let value;
      if (device.type === 'temperature') {
        value = parseFloat((15 + Math.random() * 15).toFixed(2));
      } else {
        value = parseFloat((30 + Math.random() * 50).toFixed(2));
      }

      const payload = {
        chipId: device.chipId,
        value: value,
        type: device.type
      };

      // Topic: demirtech/{chipId}/{type}
      const topic = `demirtech/${device.chipId}/${device.type}`;

      client.publish(topic, JSON.stringify(payload), (err) => {
        if (err) {
          console.error('Mesaj gönderilemedi:', err);
        } else {
          console.log(`Yayınlandı -> Topic: ${topic}, Payload:`, payload);
        }
      });
    });
  }, 1000);
});

client.on('error', (err) => {
  console.error('MQTT Hatası:', err);
});
