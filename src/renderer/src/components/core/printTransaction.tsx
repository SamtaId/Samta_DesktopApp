import { ITransaction } from '@renderer/interface/transaction.interface'

const rupiah = (val?: number): string => `Rp${(val || 0).toLocaleString('id-ID')}`

export const buildReceiptHTML = (order: ITransaction): string => {
  const itemsHTML =
    order.items?.length > 0
      ? order.items
          .map(
            (item) => `
        <div class="item">
          <div class="item-name">${item.productName}</div>

          <div class="item-row">
            <span>${item.quantity} x ${rupiah(item.price)}</span>
          </div>

          ${item.notes ? `<div class="item-note">Catatan: ${item.notes}</div>` : ''}

          <div class="divider"></div>
        </div>
      `
          )
          .join('')
      : `<div class="empty">Tidak ada item</div>`

  return `
    <div class="receipt">
      <div class="items">
        ${itemsHTML}
      </div>

      <div class="summary">
        <div class="row">
          <span>Subtotal</span>
          <span>${rupiah(order.totalAmount)}</span>
        </div>

        ${
          order.discount
            ? `<div class="row">
                <span>Diskon</span>
                <span>- ${rupiah(order.discount)}</span>
              </div>`
            : ''
        }

        ${
          order.tax
            ? `<div class="row">
                <span>Pajak</span>
                <span>${rupiah(order.tax)}</span>
              </div>`
            : ''
        }

        <div class="row total">
          <span>TOTAL</span>
          <span>${rupiah(order.grandTotal)}</span>
        </div>
      </div>
    </div>
  `
}
