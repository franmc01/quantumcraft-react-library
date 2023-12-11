declare global {
  interface Window {
    BASE_HOST_SITE: string
    ISCUSTOMDOMAIN: true;
    isInternalNavigation: boolean;
  }
}

const buildNavigationUrl = (
  pageName: string, 
  baseDomainUrl: string, 
  context: string
) => (window.ISCUSTOMDOMAIN
  ? `${baseDomainUrl}/${pageName}`
  : `${baseDomainUrl}/${context}/${pageName}`)

/**
 * Navigate to a page in the login
 * @param pageName The name of the page to navigate to
 * @param baseDomainUrl Domain of the site, provided by configuration 
 * @param context context, provided by configuration 
 * @example
 * navigateLogin('Register', baseDomainUrl, context)
 * @example
 * navigateLogin('RemindUser', baseDomainUrl, context)
 * @example
 * navigateLogin('RegeneratePassword', baseDomainUrl, context)
 */
const navigateLogin = (pageName: string, baseDomainUrl: string, context: string) => {
  window.isInternalNavigation = true
  const url = buildNavigationUrl(pageName, baseDomainUrl, context)
  const currentLanguage = localStorage.getItem('LANGUAGE') || 'en'
  document.location.href = `${url}?lang=${currentLanguage}`
}

export default navigateLogin
