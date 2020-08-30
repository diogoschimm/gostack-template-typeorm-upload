import AppError from '../errors/AppError';

import { getCustomRepository } from "typeorm";
import TransactionsRepository from "../repositories/TransactionsRepository";

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const transactionToDelete = await transactionsRepository.findOne(id);
    if (!transactionToDelete) {
      throw new AppError("Transaction not found", 404);
    }

    await transactionsRepository.delete(id);    
  }
}

export default DeleteTransactionService;
