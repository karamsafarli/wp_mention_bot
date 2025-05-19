const fs = require('fs');
const path = require('path');

const getModList = () => {
    const dir = path.join(__dirname, '../data');
    const filePath = path.join(dir, 'mods.json');
    try {
        if (!fs.existsSync(filePath)) {
            return []
        } else {
            const mods = JSON.parse(fs.readFileSync(filePath));
            return mods
        }
    } catch (error) {
        console.error(error)
    }
}

const saveModList = async (updated) => {
    const dir = path.join(__dirname, '../data');
    const filePath = path.join(dir, 'mods.json');
    try {
        const formatted = JSON.stringify(updated, null, 2);
        fs.writeFileSync(filePath, formatted, { encoding: 'utf-8' });

        console.log('Data saved')
    } catch (error) {
        console.error(error)
    }
}


module.exports = { getModList, saveModList }