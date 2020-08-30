import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const incomeTransactions = await this.find({ where: { type: 'income' } });
    const outcomeTransactions = await this.find({ where: { type: 'outcome' } });
 
    const income: number = incomeTransactions
      ? incomeTransactions.reduce((acc, current) => acc + current.value, 0)
      : 0;

    const outcome: number = outcomeTransactions
      ? outcomeTransactions.reduce((acc, current) => acc + current.value, 0)
      : 0;
 
    const balance = {
      income,
      outcome,
      total: income - outcome,
    };

    return balance;
  }
}

export default TransactionsRepository;
