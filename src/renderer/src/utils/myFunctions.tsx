import moment from 'moment/min/moment-with-locales'
moment.locale('id')

export const formatDate = (dateString: Date | string): string => {
  const date = new Date(dateString)
  const options = new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  })
  return options.format(date)
}

export const formatTime = (isoString: Date | string): string => {
  const date = new Date(isoString)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

export const formatDateTime = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }

  const date = new Date(dateString)
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const formattedDate = date.toLocaleDateString('id-ID', options).replace(/,/, '')
  const formattedTime = `${hours}:${minutes}`
  return `${formattedDate} ${formattedTime} WIB`
}

export const formatGender = (gender: string): string => {
  switch (gender) {
    case 'L':
      return 'Laki-laki'
    case 'P':
      return 'Perempuan'
    default:
      return ''
  }
}

export const decodeToken = (token: string): Record<string, unknown> => {
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join('')
  )
  return JSON.parse(jsonPayload)
}

export const getDayNow = (): string => moment().format('dddd')
export const getDayMonth = (): string => moment().format('MMMM')

export const toolbarOptions: (string | Record<string, unknown>)[][] = [
  [{ header: '1' }, { header: '2' }, { font: [] }],
  [{ size: ['small', false, 'large', 'huge'] }],
  ['bold', 'italic', 'underline', 'strike', 'blockquote'],
  [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
  ['link', 'image', 'video'],
  [{ align: [] }, { color: [] }, { background: [] }],
  ['clean']
]

export const formatRupiah = (
  angka: number | string | null | undefined,
  valas: number = 1
): string => {
  if (angka === null || angka === undefined || angka === '') {
    return '0'
  }

  const reverse = angka.toString().split('').reverse().join('')
  const ribuan = reverse.match(/\d{1,3}/g)
  const formatted = ribuan?.join('.').split('').reverse().join('') || '0'

  return valas === 0 ? formatted : 'Rp ' + formatted
}

export const formatTitleUrl = (text: string): string => {
  return text
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '-')
    .toLowerCase()
}

export const getCurrentTime = (): string => {
  const now = new Date()
  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')
  const seconds = now.getSeconds().toString().padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}

const now = new Date()
const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000)

export const formatDateTimeLocal = (date: Date): string => {
  const pad = (num: number): string => num.toString().padStart(2, '0')
  const year = date.getFullYear()
  const month = pad(date.getMonth() + 1)
  const day = pad(date.getDate())
  const hours = pad(date.getHours())
  const minutes = pad(date.getMinutes())
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

export const defaultTimeReservation = formatDateTimeLocal(oneHourLater)

export const toPlus62 = (phone: string): string | null => {
  if (!phone || typeof phone !== 'string') return null
  const digits = phone.replace(/\D+/g, '')
  if (!digits) return null

  if (digits.startsWith('0')) return '+62' + digits.slice(1)
  if (digits.startsWith('62')) return '+' + digits
  if (digits.startsWith('8')) return '+62' + digits

  const stripped = digits.replace(/^0+/, '')
  if (stripped !== digits) {
    if (stripped.startsWith('62')) return '+' + stripped
    if (stripped.startsWith('8')) return '+62' + stripped
  }

  return '+' + digits
}

export const getStartOfCurrentMonth = (): string => moment().startOf('month').format('YYYY-MM-DD')
export const getEndOfCurrentMonth = (): string => moment().endOf('month').format('YYYY-MM-DD')

const today = new Date()
export const fullDate = today.toLocaleDateString('id-ID', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric'
})
