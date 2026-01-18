import { useState, useEffect, useRef, useCallback } from 'react'
import { ITransaction } from '@renderer/interface/transaction.interface'
import TransactionService from '@renderer/services/transactionService'
import { buildReceiptHTML } from '@renderer/components/core/printTransaction'
import { transactionDB } from '@renderer/db/transactionDB'

interface UseTransactionPollerOptions {
  pollingInterval?: number // default 5000ms
  autoPrint?: boolean // default true
  enabled?: boolean // default true
}

interface TransactionWithFlags extends ITransaction {
  isPrinted?: boolean
  isNotified?: boolean
  lastUpdated?: Date
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useTransactionPoller = (options: UseTransactionPollerOptions = {}) => {
  const { pollingInterval = 5000, autoPrint = true, enabled = true } = options

  const [transactions, setTransactions] = useState<TransactionWithFlags[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isMounted = useRef(true)
  const isPolling = useRef(false)
  const isInitialLoad = useRef(true) // 🔥 FLAG UNTUK INITIAL LOAD
  const transactionServiceRef = useRef(TransactionService())

  // Print order function
  const printOrder = useCallback((transaction: ITransaction) => {
    try {
      const header1 = localStorage.getItem('outletName') || 'Outlet'
      const header2 = 'New Order'
      const header3 = `Meja: ${(transaction.tables && transaction.tables.length > 0 && transaction.tables[0]?.name) || '-'} | ${transaction.date ? new Date(transaction.date).toLocaleString('id-ID') : '-'}`

      const dataToprint = {
        header1,
        header2,
        header3,
        contentHTML: buildReceiptHTML(transaction),
        footer1: 'Terima kasih atas kunjungan Anda!',
        footer2: 'Simpan struk ini sebagai bukti pembayaran.'
      }

      window.electron.ipcRenderer.send('print-order-receipt', dataToprint)
      console.log('✅ Print sent for transaction:', transaction.id)
      return true
    } catch (error) {
      console.error('❌ Failed to print transaction:', transaction.id, error)
      return false
    }
  }, [])

  // Mark transaction as printed in DB
  const markAsPrinted = useCallback(async (transactionId: string) => {
    try {
      await transactionDB.transactions.update(transactionId, {
        isPrinted: true,
        lastUpdated: new Date()
      })
      console.log('✅ Marked as printed:', transactionId)
    } catch (error) {
      console.error('❌ Failed to mark as printed:', transactionId, error)
    }
  }, [])

  // Fetch and sync transactions
  const fetchAndSyncTransactions = useCallback(async () => {
    if (isPolling.current || !isMounted.current || !enabled) return

    isPolling.current = true

    try {
      setLoading(true)
      setError(null)

      // Fetch from API
      const response = await transactionServiceRef.current.getAllTransaction()

      if (!response.status || !response.data) {
        throw new Error('Failed to fetch transactions')
      }

      const apiTransactions: ITransaction[] = response.data

      // Get existing transactions from DB
      const dbTransactions = await transactionDB.transactions.toArray()
      const dbTransactionsMap = new Map(dbTransactions.map((t) => [t.id, t]))

      // Process each transaction
      const processedTransactions: TransactionWithFlags[] = []
      const newTransactions: TransactionWithFlags[] = []
      const updatedTransactions: TransactionWithFlags[] = []

      for (const apiTrx of apiTransactions) {
        const dbTrx = dbTransactionsMap.get(apiTrx.id)

        if (!dbTrx) {
          // NEW TRANSACTION
          const newTrx: TransactionWithFlags = {
            ...apiTrx,
            isPrinted: isInitialLoad.current ? true : false, // 🔥 MARK AS PRINTED IF INITIAL LOAD
            isNotified: false,
            lastUpdated: new Date()
          }
          newTransactions.push(newTrx)
          processedTransactions.push(newTrx)

          // Save to DB
          await transactionDB.transactions.add(newTrx)

          // 🔥 ONLY PRINT IF NOT INITIAL LOAD
          if (autoPrint && !isInitialLoad.current) {
            console.log('🖨️ Printing NEW transaction:', apiTrx.id)
            const printed = printOrder(apiTrx)
            if (printed) {
              await markAsPrinted(apiTrx.id)
              newTrx.isPrinted = true
            }
          } else if (isInitialLoad.current) {
            console.log('⏭️ Skipping print (initial load):', apiTrx.id)
          }
        } else {
          // EXISTING TRANSACTION - Check if updated
          const isUpdated =
            JSON.stringify(apiTrx) !==
            JSON.stringify({
              ...dbTrx,
              isPrinted: undefined,
              isNotified: undefined,
              lastUpdated: undefined
            })

          if (isUpdated) {
            const updatedTrx: TransactionWithFlags = {
              ...apiTrx,
              isPrinted: dbTrx.isPrinted || false,
              isNotified: dbTrx.isNotified || false,
              lastUpdated: new Date()
            }
            updatedTransactions.push(updatedTrx)
            processedTransactions.push(updatedTrx)

            // Update in DB
            await transactionDB.transactions.put(updatedTrx)

            // 🔥 ONLY PRINT IF NOT INITIAL LOAD AND NOT PRINTED YET
            if (autoPrint && !isInitialLoad.current && !dbTrx.isPrinted) {
              console.log('🖨️ Printing UPDATED transaction:', apiTrx.id)
              const printed = printOrder(apiTrx)
              if (printed) {
                await markAsPrinted(apiTrx.id)
                updatedTrx.isPrinted = true
              }
            }
          } else {
            processedTransactions.push(dbTrx)
          }
        }
      }

      // Update state
      if (isMounted.current) {
        setTransactions(processedTransactions)
      }

      // Log summary
      if (newTransactions.length > 0 || updatedTransactions.length > 0) {
        console.log('📊 Transaction Sync Summary:', {
          new: newTransactions.length,
          updated: updatedTransactions.length,
          total: processedTransactions.length,
          isInitialLoad: isInitialLoad.current
        })
      }

      // 🔥 SET INITIAL LOAD TO FALSE AFTER FIRST FETCH
      if (isInitialLoad.current) {
        console.log('✅ Initial load completed, next fetch will print new transactions')
        isInitialLoad.current = false
      }
    } catch (err) {
      console.error('❌ Error fetching transactions:', err)
      if (isMounted.current) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      }
    } finally {
      setLoading(false)
      isPolling.current = false
    }
  }, [autoPrint, enabled, printOrder, markAsPrinted])

  // Manual print function (for retry)
  const printTransaction = useCallback(
    async (transactionId: string) => {
      const transaction = transactions.find((t) => t.id === transactionId)
      if (!transaction) {
        console.error('Transaction not found:', transactionId)
        return false
      }

      const printed = printOrder(transaction)
      if (printed) {
        await markAsPrinted(transactionId)
        // Update local state
        setTransactions((prev) =>
          prev.map((t) => (t.id === transactionId ? { ...t, isPrinted: true } : t))
        )
      }
      return printed
    },
    [transactions, printOrder, markAsPrinted]
  )

  // Get unprintable transactions
  const getUnprintedTransactions = useCallback(() => {
    return transactions.filter((t) => !t.isPrinted)
  }, [transactions])

  // Setup polling
  useEffect(() => {
    isMounted.current = true

    if (!enabled) {
      return
    }

    // Initial fetch
    fetchAndSyncTransactions()

    // Setup interval
    const intervalId = setInterval(() => {
      fetchAndSyncTransactions()
    }, pollingInterval)

    return () => {
      isMounted.current = false
      clearInterval(intervalId)
    }
  }, [fetchAndSyncTransactions, pollingInterval, enabled])

  return {
    transactions,
    loading,
    error,
    printTransaction,
    getUnprintedTransactions,
    refetch: fetchAndSyncTransactions
  }
}
