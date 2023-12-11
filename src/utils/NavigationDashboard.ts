declare global {
    interface Window {
    ISCUSTOMDOMAIN: true;
    isInternalNavigation: boolean;
  }
}

const isMobileDevice = () => navigator.userAgent.match(/Android/i)
         || navigator.userAgent.match(/webOS/i)
         || navigator.userAgent.match(/iPhone/i)
         || navigator.userAgent.match(/BlackBerry/i)
         || navigator.userAgent.match(/Windows Phone/i)
         || window.isAppShell

const buildNavigationUrl = (baseDomainUrl: string, context: string) => {
  if (window.ISCUSTOMDOMAIN) {
    return `${baseDomainUrl}`
  } 

  return `${baseDomainUrl}/${context}`
}

const extractSubstringAfterSlah = (pageName) => {
  const parts = pageName.split('/')
  return parts[parts.length - 1]
}

/**
 * Navigate to a page in the dashboard
 * @param pageName The name of the page to navigate to
 * @param baseDomainUrl Domain of the site, provided by configuration 
 * @param context context, provided by configuration 
 * @example
 * navigateDashboard('Dashboard', baseDomainUrl, context)
 * @example
 * navigateDashboard('Payments', baseDomainUrl, context)
 * @example
 * navigateDashboard('Transfers', baseDomainUrl, context)
 */
const navigateDashboard = (pageName: string, baseDomainUrl: string, context: string) => {
  const isMobile = isMobileDevice()
  const pageNameCleaned = extractSubstringAfterSlah(pageName)
  window.isInternalNavigation = true

  const baseURL = buildNavigationUrl(baseDomainUrl, context)
  document.location.href = isMobile && pageNameCleaned.toLocaleLowerCase() === 'dashboard' ? `${baseURL}/home` : `${baseURL}/${pageNameCleaned}`
}

export default navigateDashboard
