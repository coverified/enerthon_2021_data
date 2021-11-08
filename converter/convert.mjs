import ExcelJS from 'exceljs';

const filename = '../input/Testdata Enerthon 21.xlsx';
const powerPlants = [];

const workbook = new ExcelJS.Workbook();
await workbook.xlsx.readFile(filename);

const sheetMasterData = workbook.getWorksheet('Master Data');

for (let i = 0; i < 18; i++) {
    const col = sheetMasterData.getColumn(i + 2);

    powerPlants.push({
        // original data
        'Name': sheetMasterData.getCell(`${String.fromCharCode(64 + col.number)}1`).value,
        'Klarname': sheetMasterData.getCell(`${String.fromCharCode(64 + col.number)}2`).value,
        'Anschlussnetzbetreiber': sheetMasterData.getCell(`${String.fromCharCode(64 + col.number)}3`).value,
        'Anschlussnetzbetreiber MP-ID': sheetMasterData.getCell(`${String.fromCharCode(64 + col.number)}4`).value,
        'SR-ID': sheetMasterData.getCell(`${String.fromCharCode(64 + col.number)}5`).value,
        'Energietraeger': sheetMasterData.getCell(`${String.fromCharCode(64 + col.number)}6`).value,
        'Regelzone': sheetMasterData.getCell(`${String.fromCharCode(64 + col.number)}7`).value,
        'Enthaltene TR (TR-ID)': sheetMasterData.getCell(`${String.fromCharCode(64 + col.number)}8`).value,
        'MasterNr. TR': sheetMasterData.getCell(`${String.fromCharCode(64 + col.number)}9`).value,
        'Klarname TR': sheetMasterData.getCell(`${String.fromCharCode(64 + col.number)}10`).value,
        'TR-ID': sheetMasterData.getCell(`${String.fromCharCode(64 + col.number)}11`).value,
        'Nettonennleistung (TRs)': sheetMasterData.getCell(`${String.fromCharCode(64 + col.number)}12`).value,
        'Geokoordinaten TRs': sheetMasterData.getCell(`${String.fromCharCode(64 + col.number)}13`).value,

        // parsed data
        'power': parseFloat(sheetMasterData.getCell(`${String.fromCharCode(64 + col.number)}12`).value.replace(' kW', '').replace('.', '').replace(',', '.')),
        'lat': parseFloat(sheetMasterData.getCell(`${String.fromCharCode(64 + col.number)}13`).value.split(' ')[0].replace('BreiteNord=', '').replace(',', '.')),
        'lng': parseFloat(sheetMasterData.getCell(`${String.fromCharCode(64 + col.number)}13`).value.split(' ')[1].replace('LaengeOst=', '').replace(',', '.')),
    });
}

console.log(powerPlants);
