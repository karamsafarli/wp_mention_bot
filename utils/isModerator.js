const { getModList } = require("../db/modlist")

const isModerator = (user) => {
    const modList = getModList();
    return modList?.includes(user)
}


module.exports = { isModerator }