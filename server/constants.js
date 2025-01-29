const createTag = require('./src/helpers/tag.helper').createTag

const measurementTypes = {
  TEMPERATURE: 'temperature',
  HUMIDITY: 'humidity',
  CURRENT: 'current',
}

let temperatureHumidityDeviceSource = '5041874'
let currentDeviceSource = '5090305'

const temperatureTag = createTag(
  '4cfa0c47-0b40-4249-a37b-c5c2e72d131a', // id field in uuid format
  'Köşe-1-Sıcaklık-Tag', // name
  'Köşe 1 cihazına ait Sıcaklık Tag tanımı', // description
  temperatureHumidityDeviceSource, // source
  10, // min
  60, // max
  0.3, // tolerance,
  measurementTypes.TEMPERATURE, // type
)

const humidityTag = createTag(
  '1535a778-934b-4f5b-a4b0-cd0067801dd0',// id field in uuid format
  'Köşe-1-Nem-Tag', // name
  'Köşe 1 cihazın ait Nem Tag tanımı', // description
  temperatureHumidityDeviceSource, // source
  5, // min
  90, // max
  0.8, // tolerance,
  measurementTypes.HUMIDITY, // type
)

const currentTag = createTag(
  '61486a11-e94b-40da-816f-c90c949fa4d0', // id field in uuid format
  'Köşe-1-Akım-Tag', // name
  'Köşe 1 cihazın ait Akım Tag tanımı', // description
  currentDeviceSource, // source
  0.2, // min
  100, // max
  0.05, // tolerance
  measurementTypes.CURRENT, // type
)

module.exports = {
  measurementTypes,
  temperatureTag,
  humidityTag,
  currentTag,
}