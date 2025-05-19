const { getModList, saveModList } = require("../db/modlist");

const setModerator = async (message) => {
    try {
        const { mentionedIds } = message;
        const modList = getModList();

        if (mentionedIds.length === 0) return;

        mentionedIds.forEach(id => {
            if (!modList.includes(id)) {
                modList.push(id)
            }
        });


        saveModList(modList)

    } catch (error) {
        console.error(error)
    }
}


const unsetModerator = async (message) => {
    try {
        const { mentionedIds } = message;
        let modList = getModList();

        if (mentionedIds.length === 0) return;

        modList = modList.filter((userId) => !mentionedIds.includes(userId))


        saveModList(modList);

    } catch (error) {
        console.error(error)
    }
}

module.exports = { setModerator, unsetModerator }