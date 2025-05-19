const fs = require('fs');
const path = require('path');

const getMarketStats = () => {
    const dir = path.join(__dirname, '../data');
    const filePath = path.join(dir, 'market.json');
    try {
        if (!fs.existsSync(filePath)) {
            return {}
        } else {
            const ms = JSON.parse(fs.readFileSync(filePath, { encoding: 'utf-8' }));
            return ms
        }
    } catch (error) {
        console.error(error)
    }
}

const saveMarketStats = (data) => {
    const dir = path.join(__dirname, '../data');
    const filePath = path.join(dir, 'market.json');
    try {
        if (!data) return;

        const formatted = JSON.stringify(data, null, 2);

        fs.writeFileSync(filePath, formatted);
        console.log('Data saved')
    } catch (error) {
        console.error(error)
    }
}

const getSmokerStats = () => {
    const dir = path.join(__dirname, '../data');
    const filePath = path.join(dir, 'smoker.json');
    try {
        if (!fs.existsSync(filePath)) {
            return {}
        } else {
            const ms = JSON.parse(fs.readFileSync(filePath, { encoding: 'utf-8' }));
            return ms
        }
    } catch (error) {
        console.error(error)
    }
}

const saveSmokerStats = (data) => {
    const dir = path.join(__dirname, '../data');
    const filePath = path.join(dir, 'smoker.json');
    try {
        if (!data) return;

        const formatted = JSON.stringify(data, null, 2);
        fs.writeFileSync(filePath, formatted);
        console.log('Data saved')
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    getMarketStats,
    saveMarketStats,
    getSmokerStats,
    saveSmokerStats
}