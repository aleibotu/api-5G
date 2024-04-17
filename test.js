const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const msg = await prisma.sensor.create({
        data: {
            name: '气象监测站',
            topic: 'sensor/005',
            payload: {
                "name": "空气质量监测站",
                "topic": "sensor/005",
                "time_now": "2024-04-17 09:34:26",
                "list": [
                    {"name": "湿度", "value": "99.7", "unit": "%RH"},
                    {"name": "温度", "value": "13.8", "unit": "°C"},
                    {"name": "PM2.5", "value": "41", "unit": "Ug/m3"},
                    {"name": "PM10", "value": "58", "unit": "Ug/m3"},
                    {"name": "CO", "value": "0.0", "unit": "ppm"},
                    {"name": "CO2", "value": "685", "unit": "ppm"},
                    {"name": "NO2", "value": "0.00", "unit": "ppm"},
                    {"name": "O3", "value": "0.00", "unit": "ppm"},
                    {"name": "气压", "value": "101.09", "unit": "mbar"},
                    {"name": "风速", "value": "3.0", "unit": "m/s"},
                    {"name": "风向", "value": "3", "unit": " ", "range": {"min": 44, "max": 66}, "dir": "西南"},
                    {"name": "雨量", "value": "18.0", "unit": "mm"},
                    {"name": "辐射", "value": "104", "unit": "1W/m2"}
                ]
            }

        }
    })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
