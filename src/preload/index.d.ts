import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      getMyConfig: () => Promise<IConfigAsset>
      getImage: () => Promise<string>
      printOrderReceipt: (data: unknown) => void
      // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
      on: (channel: string, callback: Function) => void
    }
  }
}
