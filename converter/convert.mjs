import fs from 'fs';
import ExcelJS from 'exceljs';

const filename = '../input/Testdata Enerthon 21.xlsx';
const data = [];

const workbook = new ExcelJS.Workbook();
await workbook.xlsx.readFile(filename);

const masterData = workbook.getWorksheet('Master Data');

for (let i = 0; i < 18; i++) {
    const col = masterData.getColumn(i + 2);
    const plantData = workbook.getWorksheet(`PlanungsdatenAnlage${i + 1}`);
    const obj = {
        // original data
        'Name': masterData.getCell(`${String.fromCharCode(64 + col.number)}1`).value,
        'Klarname': masterData.getCell(`${String.fromCharCode(64 + col.number)}2`).value,
        'Anschlussnetzbetreiber': masterData.getCell(`${String.fromCharCode(64 + col.number)}3`).value,
        'Anschlussnetzbetreiber MP-ID': masterData.getCell(`${String.fromCharCode(64 + col.number)}4`).value,
        'SR-ID': masterData.getCell(`${String.fromCharCode(64 + col.number)}5`).value,
        'Energietraeger': masterData.getCell(`${String.fromCharCode(64 + col.number)}6`).value,
        'Regelzone': masterData.getCell(`${String.fromCharCode(64 + col.number)}7`).value,
        'Enthaltene TR (TR-ID)': masterData.getCell(`${String.fromCharCode(64 + col.number)}8`).value,
        'MasterNr. TR': masterData.getCell(`${String.fromCharCode(64 + col.number)}9`).value,
        'Klarname TR': masterData.getCell(`${String.fromCharCode(64 + col.number)}10`).value,
        'TR-ID': masterData.getCell(`${String.fromCharCode(64 + col.number)}11`).value,
        'Nettonennleistung (TRs)': masterData.getCell(`${String.fromCharCode(64 + col.number)}12`).value,
        'Geokoordinaten TRs': masterData.getCell(`${String.fromCharCode(64 + col.number)}13`).value,

        // parsed data
        'maxPower': parseFloat(masterData.getCell(`${String.fromCharCode(64 + col.number)}12`).value.replace(' kW', '').replace('.', '').replace(',', '.')),
        'lat': parseFloat(masterData.getCell(`${String.fromCharCode(64 + col.number)}13`).value.split(' ')[0].replace('BreiteNord=', '').replace(',', '.')),
        'lng': parseFloat(masterData.getCell(`${String.fromCharCode(64 + col.number)}13`).value.split(' ')[1].replace('LaengeOst=', '').replace(',', '.')),
    };

    for (let x = 0; x < 5; x++) {
        for (let y = 0; y < 96; y++) {
            let cell = plantData.getCell(`${String.fromCharCode(64 + x + 2)}${y + 9}`);
            let plannedPower = '0';

            if (cell.value) {
                plannedPower = `${cell.value}`;
            }

            data.push({
                ...obj,
                'begin': new Date(new Date('2021-06-01T22:00Z').getTime() + (y * 15 * 60 * 1000) + (x * 24 * 60 * 60 * 1000)).toISOString(),
                'end': new Date(new Date('2021-06-01T22:00Z').getTime() + ((y + 1) * 15 * 60 * 1000) + (x * 24 * 60 * 60 * 1000)).toISOString(),
                'plannedPower': parseFloat(plannedPower.replace(',', '.')) * 1000,
            });
        }
    }
}

fs.writeFile('../converted/data.ndjson', data.map(JSON.stringify).join('\n'), err => {
    if (err) {
        console.error(err);
    }
});
