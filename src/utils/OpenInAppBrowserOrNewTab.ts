export interface OpenLinkParameter {
  /**
   * The URL or path of the link to be opened.
   * @type {string}
   * @example
   * // For an external link
   * link: 'https://www.example.com'
   * // For an internal link
   * link: '/internal/site/path'
   */
  link: string;
 
  /**
   * Determines whether the link will be opened outside of the app (e.g., in a new browser tab).
   * @type {boolean}
   * @default false
   * @example
   * isExternal: true
   */
  isExternal: boolean;
 
  /**
   * The server endpoint to be used for constructing the full URL when the link is a relative path.
   * @type {object}
   * @example
   * serverEndpoint: {
   * baseDomainUrl: 'https://www.example.com',
   * baseContext: '/iuvity'
   * }
   */
  serverEndpoint?: {
    baseDomainUrl: string;
    baseContext: string;
  };
 
  /**
   * Indicates if the function will execute while a user session is active.
   * @type {boolean}
   * @default false
   * @example
   * isSessionActive: true
   */
  isSessionActive: boolean;
}

const OpenInAppBrowserOrNewTab = async (params: OpenLinkParameter) => {
  const { 
    link, isExternal, 
    serverEndpoint,
    isSessionActive
  } = params

  const isCompleteUrl = link.startsWith('http://') || link.startsWith('https://')

  const buildInternalUrl = (path: string) => {
    if (isCompleteUrl) {
      return path
    }
    const { baseDomainUrl, baseContext } = serverEndpoint
    return window.ISCUSTOMDOMAIN ? `${baseDomainUrl}/${path}` : `${baseDomainUrl}/${baseContext}/${path}`
  }

  const openInAppBrowserOrNewTab = async (url: string) => {
    if (window.isAppShell) {
      await window.appShell.request('INAPPBROWSER', { url, activeSession: isSessionActive })
    } else {
      window.open(url, '_blank')
    }
  }

  if (isExternal) {
    await openInAppBrowserOrNewTab(link)
  } else {
    const internalUrl = buildInternalUrl(link)
    document.location = internalUrl
  }
}

export default OpenInAppBrowserOrNewTab
