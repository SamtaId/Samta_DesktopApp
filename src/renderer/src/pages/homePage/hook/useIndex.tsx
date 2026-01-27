/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useNotifier } from '@renderer/components/core/NotificationProvider'
import { buildReceiptHTML } from '@renderer/components/core/printTransaction'
import { ITransaction } from '@renderer/interface/transaction.interface'
import TransactionService from '@renderer/services/transactionService'
import { formatDateTime } from '@renderer/utils/myFunctions'
import { useState, useMemo, useEffect, useRef } from 'react'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useIndex = () => {
  const notifier = useNotifier()
  const transactionService = TransactionService()
  const [orders, setOrders] = useState<ITransaction[]>([])

  const stats = useMemo(
    () => ({
      pending: orders.filter((o) => o.status === 'pending').length,
      cooking: orders.filter((o) => o.status === 'cooking').length,
      done: orders.filter((o) => o.status === 'done').length,
      total: orders.length
    }),
    [orders]
  )

  const updateOrderStatus = (id: string, newStatus: ITransaction['status']) => {
    notifier.show({
      message: 'Status Pesanan Diperbarui',
      description: 'Status pesanan telah berhasil diperbarui.',
      severity: 'success'
    })
    if (newStatus === 'cooking') {
      // find the order details to include in the thermal print
      const order = orders.find((o) => o.id === id)
      if (order) {
        printOrder(order)
      }
    }
    setOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, status: newStatus } : order))
    )
  }

  const getOrdersByStatus = (status: ITransaction['status']) => {
    return orders.filter((order) => order.status === status)
  }

  // helper to print a single order via main process
  const printOrder = (order: ITransaction) => {
    try {
      const header1 = localStorage.getItem('outletName') || 'Outlet'
      const header2 = 'Checking Order'
      const header3 = `Meja: ${(order.tables && order.tables.length > 0 && order.tables[0]?.name) || '-'} | ${order.date ? formatDateTime(order.date) : '-'}`
      const dataToprint = {
        header1,
        header2,
        header3,
        contentHTML: buildReceiptHTML(order),
        footer1:
          'Terima kasih atas kunjungan Anda!\nSemoga hari Anda menyenangkan.\nFollow kami di Instagram @samta.id untuk promo menarik.',
        footer2: 'Simpan struk ini sebagai bukti pembayaran.'
      }

      window.electron.ipcRenderer.send('print-order-receipt', dataToprint)
    } catch (e) {
      console.error('Failed to send print for new order', e)
    }
  }

  // fetch and merge: poller will use this to avoid unnecessary state updates
  const fetchOrderData = async () => {
    try {
      const response = await transactionService.getAllTransaction()
      if (response.status) {
        const incoming: ITransaction[] = response.data || []

        // compare with current orders via ref to avoid stale closure
        const current = ordersRef.current

        // find new items (by id)
        const currentIds = new Set(current.map((o) => o.id))
        const added = incoming.filter((o) => !currentIds.has(o.id))

        // find updated items (same id but different content)
        const changed: ITransaction[] = []
        const incomingMap = new Map(incoming.map((o) => [o.id, o]))
        for (const o of current) {
          const inc = incomingMap.get(o.id)
          if (inc && JSON.stringify(inc) !== JSON.stringify(o)) {
            printOrder(inc)
          }
        }

        // CETAK ORDER BARU
        if (added.length > 0) {
          console.log('New orders detected:', added.length)
          added.forEach((order) => {
            console.log('Printing new order:', order.id)
            printOrder(order)
          })
        }

        setOrders((prev) => {
          // incorporate changed items by replacing existing entries
          let next = prev.map((p) => {
            const ch = changed.find((c) => c.id === p.id)
            return ch ? ch : p
          })

          // prepend newly added items
          if (added.length > 0) {
            // dedupe just in case
            const addedFiltered = added.filter((a) => !next.find((n) => n.id === a.id))
            next = [...addedFiltered, ...next]
          }

          return next
        })
      }
    } catch (error) {
      console.log(error)
      notifier.show({
        message: 'Gagal Memuat Data Pesanan',
        description: 'Terjadi kesalahan saat memuat data pesanan.',
        severity: 'warning'
      })
    }
  }

  // keep a ref to current orders for interval callbacks
  const ordersRef = useRef<ITransaction[]>(orders)
  useEffect(() => {
    ordersRef.current = orders
  }, [orders])

  // poll every 5 seconds and on mount
  useEffect(() => {
    let mounted = true
    // initial fetch
    fetchOrderData()

    const id = setInterval(() => {
      if (!mounted) return
      fetchOrderData()
    }, 5000)

    return () => {
      mounted = false
      clearInterval(id)
    }
  }, [])

  return {
    orders,
    stats,
    updateOrderStatus,
    getOrdersByStatus
  }
}
