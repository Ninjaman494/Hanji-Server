import { readFileSync, writeFileSync } from 'fs';
import generateDict from './generateDict';

const fileData = readFileSync(
  './src/features/autocorrect/tokentable_simple.txt',
);
const dictMap = generateDict(fileData.toString());

let csvContent = '';
dictMap.forEach((val, key) => {
  console.log('Writing:', key);
  csvContent += `${key},${val[0]},${val[1]} \r\n`;
});

writeFileSync('./dict.csv', csvContent);
