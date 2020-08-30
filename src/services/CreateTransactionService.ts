import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import { getCustomRepository, getRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: any;
  category: string;
}
class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoryFinded = await this.getCategory(category);

    if (type === 'outcome') {
      const balance = await transactionsRepository.getBalance();
      if (balance.total - value < 0) {
        throw new AppError('Balance unavailable', 400);
      }
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: categoryFinded.id,
    });
    await transactionsRepository.save(transaction);
  
    delete transaction.category_id;
    transaction.category = categoryFinded;

    return transaction;
  }

  private async getCategory(title: string): Promise<Category> {
    const categoriesRepository = getRepository(Category);

    const categoryFinded = await categoriesRepository.findOne({
      where: { title },
    });

    if (!categoryFinded) {
      const categoryCreated = categoriesRepository.create({
        title,
      });
      await categoriesRepository.save(categoryCreated);

      return categoryCreated;
    }

    return categoryFinded;
  }
}

export default CreateTransactionService;
