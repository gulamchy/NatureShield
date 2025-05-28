const fs = require('fs');
const path = require('path');

const rawData = fs.readFileSync(path.join(__dirname, 'species.json'), 'utf8');
const jsonData = JSON.parse(rawData);

const dataArray = jsonData.data; // Directly use jsonData.data since that's the array

let csv = 'id,commonname,scientificname,count\n';
dataArray.forEach(item => {
  const id = item[0] || '';
  const common = item[1] || '';
  const scientific = item[2] || '';
  const count = item[3] || '';
  csv += `"${id}","${common}","${scientific}","${count}"\n`;
});

fs.writeFileSync(path.join(__dirname, 'species.csv'), csv, 'utf8');
console.log('species.csv created successfully.');
