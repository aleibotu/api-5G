const {isStartTimeBeforeEndTime, isTimeScaleLessThan7Days, isValidTimeString} = require("./lib/utils");

const express = require('express')
const {PrismaClient} = require('@prisma/client')
const mqtt = require("mqtt");

require('dotenv').config();

const {
    MQTT_BROKER_HOST,
    MQTT_USER_NAME,
    MQTT_PASS_WORD
} = process.env;

const prisma = new PrismaClient()

const app = express();

const clientId = "id_" + Math.random().toString(16).substring(2, 8);
const topic = 'sensor/005'

main()

function main() {
    const client = mqtt.connect(`ws://${MQTT_BROKER_HOST}:8083/mqtt`, {
        clientId,
        username: MQTT_USER_NAME,
        password: MQTT_PASS_WORD
    });

    client.on("connect", () => {
        console.log("Connected to MQTT broker");
        // subscribe all topics.
        client.subscribe(topic, (err) => {
            if (err) {
                console.error("Error subscribing to MQTT topic:", err);
            } else {
                console.log("Subscribed to MQTT topic:", topic);
            }
        });

    });

    client.on("message", async (topic, message) => {
        await handleMessage(topic, message);
    });

    client.on('error', (error) => {
        console.log(error)
    })
}

async function handleMessage(topic, message) {
    try {
        const msg = JSON.parse(message.toString());
        await prisma.sensor.create({
            data: {
                name: '气象监测站',
                topic: 'sensor/005',
                payload: msg
            }
        })
        console.log('msg created: ', msg)
    } catch (error) {
        console.error("Error handling MQTT message:", error);
    }
}

app.get('/5g/sensor', async (req, res) => {
    // 这里能用一下 zod 最好了
    const {topic, startTime, endTime, pageIndex, pageSize} = req.query;

    // parameter missing
    if(!topic || !startTime || !endTime) {
        res.status(422).send({success: false, msg: 'parameters missing'})
        return;
    }

    if(!isValidTimeString(startTime) && !isValidTimeString(endTime)) {
        res.status(400).send({success: false, msg: 'bad timeString format'})
        return;
    }

    if(!isStartTimeBeforeEndTime(startTime, endTime)) {
        res.status(400).send({success: false, msg: 'End time should be later than start time'})
        return;
    }

    // no pagination needed.
    if(!isTimeScaleLessThan7Days(startTime, endTime)) {
        res.status(400).send({success: false, msg: '7 days timescale max'})
        return;
    }

    const resp = await getData(topic, startTime, endTime)
        .then(async (d) => {
            await prisma.$disconnect()
            return d
        })
        .catch(async (e) => {
            console.error(e)
            await prisma.$disconnect()
            process.exit(1)
        })

    res.send({success: true, data: resp});
});

async function getData (topic, startTime, endTime) {
    return await prisma.sensor.findMany({
        where: {
            create_at: {
                gte: new Date(startTime), // equal and greater than
                lt: new Date(endTime), // less than
            },
            topic: {equals: topic}
        },
        select: {
            payload: true
        }
    });
}


const port = 3002;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


