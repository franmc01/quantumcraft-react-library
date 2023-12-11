import ConsoleLog from './ConsoleLog'

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    isAppShell: boolean;
    appShell: {
      request: Function;
    };
  }
}

type responsePDF = { generatedFile: boolean }
type mimeSupport = 'application/pdf' | 'text/csv' | 'application/csv'

const DownloadReportFile = async (
  base64Str: string,
  filenameAttachment: string,
  mimeType: mimeSupport = 'application/pdf'
): Promise<responsePDF> => {
  let generatedFile = false
  try {
    if (window.isAppShell) {
      await window.appShell.request('DOWNLOAD_FILE', { base64Str, filenameAttachment, mimeType })
    } else {
      // if (base64Str instanceof Blob) {
      //   const data = new Blob([base64Str, filenameAttachment
      // }
      const linkSource = `data:${mimeType};base64,${base64Str}`
      const downloadLink = document.createElement('a')
      const extension = mimeType.toLowerCase().split('/')[1]
      downloadLink.href = linkSource
      downloadLink.download = `${filenameAttachment}.${extension}`
      downloadLink.click()
    }
    generatedFile = true
  } catch (error) {
    ConsoleLog.error('DOWNLOAD::FILE', error)
    generatedFile = false
  }

  return {
    generatedFile
  }
}

export default DownloadReportFile
