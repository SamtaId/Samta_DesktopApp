import React, { createContext, useContext } from 'react'
import { useTransactionPoller } from '@renderer/hooks/useTransactionPoller'
import { useConfigStore } from '@renderer/store/configProvider'

const TransactionAutoPrintContext = createContext<ReturnType<typeof useTransactionPoller> | null>(
  null
)

export const TransactionAutoPrintProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const { config } = useConfigStore.getState()
  const transactionData = useTransactionPoller({
    pollingInterval: config?.refresh_time_trx || 5000,
    autoPrint: config?.auto_print_transaction || false,
    enabled: config?.auto_print_transaction || false
  })

  return (
    <TransactionAutoPrintContext.Provider value={transactionData}>
      {children}
    </TransactionAutoPrintContext.Provider>
  )
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useTransactions = () => {
  const context = useContext(TransactionAutoPrintContext)
  if (!context) {
    throw new Error('useTransactions must be used within TransactionAutoPrintProvider')
  }
  return context
}
