const fs = require('fs');
const path = require('path');

const getBanList = () => {
    const dir = path.join(__dirname, '../data');
    const filePath = path.join(dir, 'banned.json');
    try {
        if (!fs.existsSync(filePath)) {
            return []
        } else {
            const bannedUsers = JSON.parse(fs.readFileSync(filePath));
            return bannedUsers
        }
    } catch (error) {
        console.error(error)
    }
}

const saveBanList = async (updated) => {
    const dir = path.join(__dirname, '../data');
    const filePath = path.join(dir, 'banned.json');
    try {
        const formatted = JSON.stringify(updated, null, 2);
        fs.writeFileSync(filePath, formatted, { encoding: 'utf-8' });

        console.log('Data saved')
    } catch (error) {
        console.error(error)
    }
}


module.exports = { getBanList, saveBanList }