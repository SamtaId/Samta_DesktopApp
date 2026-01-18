import Dexie, { Table } from 'dexie'
import { ITransaction } from '@renderer/interface/transaction.interface'

export interface ITransactionLocal extends ITransaction {
  isPrinted?: boolean
  isNotified?: boolean
  lastUpdated?: Date
}

export class TransactionDB extends Dexie {
  transactions!: Table<ITransactionLocal, string>

  constructor() {
    super('SamtaTransactionDB')

    this.version(1).stores({
      transactions: 'id, status, isPrinted, isNotified, date, outletId, lastUpdated'
    })
  }
}

export const transactionDB = new TransactionDB()
