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
 * @return  {bool}
 */
const isSelectorValid = (selector: string): boolean => {
  try { document.querySelector(selector) }
  catch { return false }
  return true
}

export default (() => {
  window.addEventListener('popstate', () => {
    if (window.location.hash.match(/#(\d+)/)) {
      smoothScrollTo('#flipbook')
    }
  }, { passive: false, capture: true })

  window.addEventListener('click', event => {
    smoothScrollTo(event.target as HTMLElement, event);
  }, { passive: false, capture: true })
})();
