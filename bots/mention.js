const mentionGivenList = async (message, list) => {
    try {
        let text = '';
        let mentions = [];

        for (let participant of list) {
            mentions.push(`${participant}@c.us`);
            text += `@${participant} `;
        }

        await message.reply(text, null, { mentions });
    } catch (error) {
        console.log(error)
    }
}



module.exports = { mentionGivenList }