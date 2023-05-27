import { generateDict } from '../features/autocorrect/generateDict';
import { writeFileSync } from 'fs';

const writeToFile = (contents: Map<string, [number, string]>) => {
  let csvContent = '';
  contents.forEach((val, key) => {
    console.log('Writing:', key);
    csvContent += `${key},${val[0]},${val[1]} \r\n`;
  });

  writeFileSync('./dict.csv', csvContent);
};

const text = generateDict('./src/features/autocorrect/tokentable_simple.txt');
writeToFile(text);
