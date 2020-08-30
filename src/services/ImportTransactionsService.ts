import fs from 'fs';
import path from 'path';
import parse from 'csv-parse';

import Transaction from '../models/Transaction';
import uploadConfig from '../config/uploadConfig';
import CreateTransactionService from './CreateTransactionService';
 
class ImportTransactionsService {
  async execute(filename: string): Promise<Transaction[]> {
    const pathfilename = path.join(uploadConfig.directory, filename);
    
    const readCSVStream = fs.createReadStream(pathfilename);
    const parser = parse({ delimiter: ',' });
    const parseCSV = readCSVStream.pipe(parser);
 
    const lines : string[][] = [];
  
    parseCSV.on('data', line => {
      lines.push(line);
    });
    
    await new Promise(resolve => {
      parseCSV.on('end', resolve);
    });

    const createTransaction = new CreateTransactionService();
    const transactions:Transaction[] = [];

    for (let index = 1; index < lines.length; index++) { 

      const [ title, type, value, category  ] = lines[index];
      const objectTransaction = {
        title: title.trim(),
        type: type.trim(),
        value: Number(value),
        category: category.trim(),
      }
      const transaction = await createTransaction.execute(objectTransaction);

      transactions.push(transaction);         
    } 
    return transactions;
  }
}

export default ImportTransactionsService;
