const axios = require('axios');

// Manuel olarak tanımlanmış chipId'ler (100 adet)
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
  "1000045", "1000046", "1000047", "1000048", "1000049",
];

// Sabit climateId
const climateId = "7b38f334-ca97-489e-ab72-fb0a70687410";

// API endpoint URL (kendi endpoint'iniz ile güncelleyin)
const url = 'http://localhost:3000/api/devices';

async function sendRequests() {
  for (const chipId of chipIds) {
    const body = {
      name: "DT-100",
      chipId: chipId,
      deviceType: "DT-100",
      measurementType: "TEMPERATURE",
      climateId: climateId
    };

    try {
      const response = await axios.post(url, body, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log(`Chip ID ${chipId} isteği başarılı. Yanıt:`, response.data);
    } catch (error) {
      console.error(`Chip ID ${chipId} için istek gönderilirken hata:`, error.message);
    }
  }
}

sendRequests();
