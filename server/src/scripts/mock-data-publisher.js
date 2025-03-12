const mqtt = require('mqtt');

// MQTT broker adresi (örneğin broker.emqx.io)
const client = mqtt.connect('mqtt://broker.emqx.io', { username: 'emqx', password: 'password' });

// Chip ID'leri manuel olarak tanımlıyoruz (50 adet)
const chipIds = [
  "1000000", "1000001", "1000002", "1000003", "1000004",
  "1000005", "1000006", "1000007", "1000008", "1000009",
  "1000010", "1000011", "1000012", "1000013", "1000014",
  "1000015", "1000016", "1000017", "1000018", "1000019",
  "1000020", "1000021", "1000022", "1000023", "1000024",
  "1000025", "1000026", "1000027", "1000028", "1000029",
  "1000030", "1000031", "1000032", "1000033", "1000034",
  "1000035", "1000036", "1000037", "1000038", "1000039",
  "1000040", "1000041", "1000042", "1000043", "1000044",
  "1000045", "1000046", "1000047", "1000048", "1000049"
];

// Her chipId için "temperature" ve "humidity" cihazları oluşturuluyor
const devices = chipIds.flatMap(chipId => [
  { chipId, type: 'temperature' },
  { chipId, type: 'humidity' }
]);

client.on('connect', () => {
  console.log('MQTT broker\'a bağlanıldı.');

  // Her saniye, tüm cihazlar için random değer üreterek mesaj gönderimi
  setInterval(() => {
    devices.forEach(device => {
      let value;
      // Cihaz tipine göre değer aralığı belirleniyor:
      // temperature: 15 - 30, humidity: 30 - 80
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

      // Topic: demirtech/{chipId}/{type} formatında
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
