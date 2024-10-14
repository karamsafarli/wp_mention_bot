require('dotenv').config();
const express = require('express');
const { Client, LocalAuth, Poll } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const client = new Client({
    authStrategy: new LocalAuth()
});

client.once('ready', () => {
    console.log('Client is ready!');
});

client.on('qr', (qr) => {
    // qrcode.generate(qr, { small: true });

    qrcode.toDataURL(qr, (err, url) => {
        if (err) {
            console.error('Error generating QR code:', err);
            return;
        }
        console.log('QR Code URL:', url);
    });
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });



async function summarizeMessagesWithGemini(messagesArray, userName, keyword = '') {
    try {
        //         const prompt = `
        //     You are an assistant tasked with summarizing the **most important** content from the last 100-200 WhatsApp group messages. The objective is to generate concise summaries that highlight only critical and relevant information, avoiding casual chatting, personal messages, emotional discussions, or irrelevant content.

        //     Here are the requirements for your response:
        //     1. **Prioritize messages** that contain announcements, instructions, key discussions, decisions, or questions that are informative or actionable. Ignore trivial or unimportant messages like greetings, small talk, jokes, or emotional expressions.
        //     2. If a specific **keyword** is provided, focus and prioritize the messages that are related to that keyword. Disregard messages unrelated to the keyword unless they contain highly important information.
        //     3. If any message mentions **${userName}**, prioritize and emphasize those messages, as they are likely more relevant to the user requesting the summary.
        //     4. **Exclude any messages that contain previous summary results** or messages where the user requested a summary, as these are not relevant to the current summarization task.
        //     5. Provide the summary as a **numbered list** of separate and concise summaries, with each summary on a new line. Do not return an array format; instead, provide a numbered list with a line break between each summary. The format should look like this:
        //         1) Summary 1
        //         2) Summary 2
        //         3) Summary 3
        //     6. Do **not** include any extra comments or conversational language such as “Do you need anything else?” or “Let me know if you have any more questions.”
        //     7. Ensure that each summary is **highly relevant and concise**, written in 1-2 sentences, capturing only the most essential points.
        //     8. **Avoid redundancy**: Only summarize messages that add new information or valuable insights. Do not repeat the same idea or restate similar points multiple times.
        //     9. Translate the summaries into the **Azerbaijani language** before responding, while preserving the meaning and accuracy of the summaries.

        //     Below are the **group messages** as an array of objects in the format \`{messageBody, author}\`. Process and summarize them based on the instructions above.

        //     Messages: ${JSON.stringify(messagesArray)}

        //     If a keyword is provided, it will appear after the word "keyword" below. If no keyword is given, summarize based on overall message importance.

        //     Keyword: ${keyword || 'None'}
        // `;


        const prompt = `
    You are an assistant tasked with summarizing the **most important** content from the last 100-200 WhatsApp group messages. The goal is to generate **concise summaries** that focus only on **critical and relevant** information, avoiding casual chatting, personal messages, emotional discussions, or irrelevant content.

    Here are the requirements for your response:
    1. **Prioritize messages** containing announcements, instructions, key discussions, decisions, or actionable questions. Ignore trivial messages like greetings, small talk, jokes, or emotional expressions.
    2. If a specific **keyword** is provided, focus and prioritize only messages that relate to that keyword. Disregard unrelated messages unless they contain critical information.
    3. If any message mentions **${userName}**, prioritize and emphasize those messages, as they are likely more relevant to the user requesting the summary.
    4. **Exclude any messages** that contain previous summaries or requests for summaries, as they are not relevant to the current task.
    5. Provide the summary as a **numbered list** with each item on a new line, limiting the total number of summaries to **10-15**. The format should look like this:
        1) Summary 1
        2) Summary 2
        3) Summary 3
    6. Do **not** include any extra comments or conversational language such as "Do you need anything else?" or "Let me know if you have more questions."
    7. Ensure that each summary is **highly relevant and concise**, written in 1-2 sentences, capturing only the most essential points.
    8. **Avoid redundancy**: Only summarize messages that add new information or valuable insights. Do not repeat the same ideas or restate similar points.
    9. Translate the summaries into **Azerbaijani** before responding, ensuring accuracy and meaning are preserved.
    10. The final summary must contain no more than 10-15 unique and important points.

    Below are the **group messages** as an array of objects in the format \`{messageBody, author}\`. Process and summarize them based on the instructions above.

    Messages: ${JSON.stringify(messagesArray)}

    If a keyword is provided, it will appear after the word "keyword" below. If no keyword is given, summarize based on overall message importance.

    Keyword: ${keyword || 'None'}
`;





        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        return error
    }
}


let isSummaryRequested = false;


client.on('message_create', async (message) => {


    if (message.body === 'test') {
        message.reply('Test working')
    }


    if (message.body === '@all') {
        const chat = await message.getChat();

        let text = '';
        let mentions = [];

        for (let participant of chat.participants) {
            mentions.push(`${participant.id.user}@c.us`);
            text += `@${participant.id.user} `;
        }

        await chat.sendMessage(text, { mentions });
        console.log(`Mentioned ${mentions.length} users`)
    }



    if (message.type === 'chat' && message.body.split(' ')[0] === '!sum') {
        if (isSummaryRequested) {
            await message.reply("Sırada başqaları var, biraz səbrli ol 😉")
        }


        else {
            isSummaryRequested = true;
            let keyword = '';
            let messageLimit = 100;
            const [_, firstParam, secondParam] = message.body.split(' ')

            if (firstParam && !isNaN(parseInt(firstParam))) {
                messageLimit = parseInt(firstParam);
            } else if (firstParam) {
                keyword = firstParam
            }

            if (secondParam && !isNaN(parseInt(secondParam))) {
                messageLimit = parseInt(secondParam);
            } else if (secondParam) {
                keyword = secondParam
            }

            const cmdAuthorId = message.author || message.from;
            const cmdContact = await client.getContactById(cmdAuthorId);
            const cmdAuthorName = cmdContact.pushname || cmdContact.name || cmdContact.number;

            const chat = await message.getChat();
            const messages = await chat.fetchMessages({ limit: messageLimit });

            const collectedMessages = [];

            for (const msg of messages) {
                if (msg.type !== 'chat') continue;


                const messageBody = msg.body;
                const authorId = msg.author || msg.from;
                const contact = await client.getContactById(authorId);
                const authorName = contact.pushname || contact.name || contact.number;

                collectedMessages.push({ messageBody, author: authorName });

            }

            messageLimit = messageLimit > 200 ? 200 : messageLimit;

            const summary = await summarizeMessagesWithGemini(collectedMessages, cmdAuthorName, keyword);
            const replyHeader = keyword ? `*Summary of the last ${messageLimit} messages, for "${keyword}" keyword:*` : `*Summary of the last ${messageLimit} messages:*`
            await message.reply(`${replyHeader} \n \n ${summary}`);

            isSummaryRequested = false;
        }
    }


    if (message.body.split(' ')[0] === '!poll') {
        const [pollName, ...pollOptions] = message.body.split(' ').slice(1).join(' ').split(',').map(t => t.trim());
        const isMultipleAnswered = pollOptions[pollOptions.length - 1] === 'multi' ? true : false;
        const options = isMultipleAnswered ? pollOptions.slice(0, -1) : pollOptions;
        const poll = new Poll(pollName, options, { allowMultipleAnswers: isMultipleAnswered });
        await message.reply(poll);
    }


});



client.initialize();



const app = express();

app.get('/', (_, res) => {
    res.json({ msg: 'Hello' })
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})