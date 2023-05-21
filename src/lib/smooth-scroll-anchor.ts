/**
 * Scroll to an anchor with a nice smooth animation
 *
 * @param   {Event}        event
 * @param   {HTMLElement}  target
 *
 * @return  {void}
 */
const smoothScrollTo = (target: HTMLElement | string, event?: Event): void => {
  const id = event ? target.getAttribute('href') : target;

  if (id === null || id === '#' || !isSelectorValid(id)) return;

  if (event) event.preventDefault();

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

  window.addEventListener('hashchange', (event) => {
    // if query string is number
    if (window.location.href.match(/#(\d+)/)) {
      smoothScrollTo('#flipbook')
    }
  });

  allAnchorLinks.forEach(link => {
    link.addEventListener('click', event => {
      smoothScrollTo(event.target as HTMLElement, event);
    })
  })
})();
