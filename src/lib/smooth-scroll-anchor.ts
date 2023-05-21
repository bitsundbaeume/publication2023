
/**
 * Scroll to an anchor with a nice smooth animation
 *
 * @param   {Event}        event
 * @param   {HTMLElement}  target
 *
 * @return  {void}
 */
const smoothScrollTo = (event: Event, target: HTMLElement) => {
  const id = target.getAttribute('href');

  if (id === null || id === '#' || !isSelectorValid(id)) return;

  event.preventDefault();

  document.querySelector(id)?.scrollIntoView({
    block: 'start',
    behavior: 'smooth',
    inline: 'start',
  });

};

/**
 * Check if a selector is valid
 *
 * @param   {string}  selector  DOM selector
 *
 */
const queryCheck = (selector: string) => document.createDocumentFragment().querySelector(selector)

/**
 * Check if a selector is valid
 *
 * @param   {string}  selector  DOM selector
 *
 * @return  {bool}
 */
const isSelectorValid = (selector: string) => {
  try { queryCheck(selector) }
  catch { return false }
  return true
}

export default (() => {
  const allAnchorLinks = document.querySelectorAll('a[href^="#"]');
  // const pushState = history.pushState;
  // console.log(pushState);
  // const myOldUrl = window.location.href;
  window.addEventListener('hashchange', (event) => {
    console.log('hashchange', window.location.href, event.target);

    // window.history.pushState({}, null, myOldUrl);
  });
  allAnchorLinks.forEach(link => {
    link.addEventListener('click', event => {
      smoothScrollTo(event, event.target as HTMLElement);
    })
  })
})();
