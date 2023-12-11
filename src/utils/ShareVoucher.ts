import html2canvas from 'html2canvas'
import ConsoleLog from './ConsoleLog'

const downloadImage = (blob: string, fileName: string) => {
  const fakeLink = window.document.createElement('a')
  // fakeLink.style = 'display:none;'
  fakeLink.download = fileName
  fakeLink.href = blob

  document.body.appendChild(fakeLink)
  fakeLink.click()
  document.body.removeChild(fakeLink)

  fakeLink.remove()
}

const ShareVoucher = async (element: HTMLDivElement, imageFileName: string) => {
  const userAgentRN = window.navigator.userAgent
  const html = document.getElementsByTagName('html')[0]
  const body = document.getElementsByTagName('body')[0]
  let htmlWidth = html.clientWidth
  let bodyWidth = body.clientWidth

  const newWidth = element.scrollWidth - element.clientWidth

  if (newWidth > element.clientWidth) {
    htmlWidth += newWidth
    bodyWidth += newWidth
  }

  html.style.width = `${htmlWidth}px`
  body.style.width = `${bodyWidth}px`

  const canvas = await html2canvas(element)
  const image = canvas.toDataURL('image/png', 1.0)

  if (userAgentRN !== 'ModyoShell') {
    downloadImage(image, imageFileName)
  }

  if (userAgentRN === 'ModyoShell' && window.isAppShell) {
    try {
      await window.appShell.request('SHARE_IMAGE', {
        image,
        imageFileName
      })
    } catch (error) {
      ConsoleLog.error('SHARE::FILE', error)
    }
  }

  html.style.width = ''
  body.style.width = ''
}

export default ShareVoucher
