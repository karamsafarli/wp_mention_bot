const { Client, LocalAuth, Poll } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth()
});

client.once('ready', () => {
    console.log('Client is ready!');
});

client.on('disconnected', (reason) => {
    console.error('Client was disconnected', reason);
});

client.on('auth_failure', (msg) => {
    console.error('Authentication failure', msg);
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});


const balbesList = [
    '994555109523',
    '994555654648',
    '994107260395',
    '994507980266',
    '994513300091',
    '994515002600',
    '994517671544',
    '994552920199',
    '994554050897',
    '994706184747',
    '994774513045'
]

const pubgList = [
    '994555109523',
    '994773900504',
    '994773035069',
    '994507426759',
    '994554048181',
    '994559014435',
    '994552841572',
    '994513658929'
]

const smokerList = [
    '994513300091', // hidayat
    '994552920199', // fuad
    '994554050897', // orkan
    '994515002600' // gadir
]

const marketStats = {};

const smokerStats = {};

const mentionBalbes = async (message) => {
    try {
        // const chat = await message.getChat();

        // let text = '';
        // let mentions = [];

        // for (let participant of chat.participants) {
        //     mentions.push(`${participant.id.user}@c.us`);
        //     text += `@${participant.id.user} `;
        // }
        const statAuthor = marketStats[message.author]
        if (statAuthor) {
            statAuthor.count = statAuthor.count + 1
        }

        else {
            marketStats[message.author] = { notifyName: message?._data?.notifyName, count: 1 }
        }

        let text = '';
        let mentions = [];

        for (let participant of balbesList) {
            mentions.push(`${participant}@c.us`);
            text += `@${participant} `;
        }

        // await chat.sendMessage(text, { mentions });
        await message.reply(text, null, { mentions });
    } catch (error) {
        console.log(error)
    }
}

const mentionSmokers = async (message) => {
    try {
        const statAuthor = smokerStats[message.author]
        if (statAuthor) {
            statAuthor.count = statAuthor.count + 1
        }

        else {
            smokerStats[message.author] = { notifyName: message?._data?.notifyName, count: 1 }
        }

        let text = '';
        let mentions = [];

        for (let participant of smokerList) {
            mentions.push(`${participant}@c.us`);
            text += `@${participant} `;
        }

        await message.reply(text, null, { mentions });
    } catch (error) {
        console.log(error)
    }
}

const mentionGivenList = async (message, list) => {
    try {
        let text = '';
        let mentions = [];

        for (let participant of list) {
            mentions.push(`${participant}@c.us`);
            text += `@${participant} `;
        }

        // await chat.sendMessage(text, { mentions });
        await message.reply(text, null, { mentions });
    } catch (error) {
        console.log(error)
    }
}

const mentionAndPollPubg = async (message) => {
    try {
        const poll = new Poll('22:30 qanlı pubg', ['Hə 🤠', 'Yox 💅🏻'], { allowMultipleAnswers: false });
        await message.reply(poll)
        await mentionGivenList(message, pubgList)
    } catch (error) {
        console.log(error)
    }
}

const displayMarketStats = async (message) => {
    const stats = Object.values(marketStats);
    // const chat = await message.getChat();

    if (stats?.length === 0) {
        await message.reply('Hələ ki marketə gedən yoxdu')
        return
    }

    let statsMessage = ``;
    stats.forEach(stat => {
        statsMessage += `*${stat?.notifyName}* - ${stat?.count} dəfə \n`
    })

    await message.reply(statsMessage)
}

const displaySmokerStats = async (message) => {
    const stats = Object.values(smokerStats);

    if (stats?.length === 0) {
        await message.reply('Hələ ki siqaretə çıxan yoxdu')
        return
    }

    let statsMessage = ``;
    stats.forEach(stat => {
        statsMessage += `*${stat?.notifyName}* - ${stat?.count} dəfə \n`
    })

    await message.reply(statsMessage)
}

client.on('message_create', async (message) => {

    // 994505873906@c.us


    // if (message?.author === '994505873906@c.us') {
    //     await message.reply('Zəhmət olmasa qrupda dini, irqi, irsi, mədəni dəyərlərə zərər vuracaq ifadələrdən istifadə etməyin!')
    // }

    if (
        message.body?.toLowerCase()?.includes('@all') ||
        message.body?.toLowerCase()?.includes('!all') ||
        message.body?.toLowerCase()?.includes('!opsi') ||
        message.body?.toLowerCase()?.includes('!hami') ||
        message.body?.toLowerCase() === '!market'
    ) {
        mentionBalbes(message)
    }

    if (message.body?.toLowerCase()?.includes('!siqaret')) {
        mentionSmokers(message)
    }

    if (message.body?.toLowerCase()?.includes('!marketstats')) {
        displayMarketStats(message)
    }

    if (message.body?.toLowerCase()?.includes('!smokerstats')) {
        displaySmokerStats(message)
    }

    if (message.body?.toLowerCase()?.includes('!pubg')) {
        mentionAndPollPubg(message)
    }


    if (message.body === '!test') {
        console.log(message)
        // message
        console.log(message?._data?.notifyName)
        await message.reply('Test working!')
    }


    // if (message.body === '!milan') {
    //     const chat = await message.getChat();
    //     const numbers = ['994552585977', '994554048181', '994703791079', '994503853943', '994514101509'];

    //     let text = '';
    //     let mentions = [];

    //     for (let participant of numbers) {
    //         mentions.push(`${participant}@c.us`);
    //         text += `@${participant} `;
    //     }

    //     // await chat.sendMessage(text, { mentions })
    //     await message.reply(text, null, { mentions })
    // }

});

client.initialize();

