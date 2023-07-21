export const smoothScrollTo = (
  target: HTMLElement | string,
  event?: Event,
): void => {
  let id = event ? (target as HTMLElement).getAttribute("href") : target;
  const isRootDomain = window.location.pathname === "/";
  if (typeof id === "string" && isRootDomain) {
    id = id.replace(/^\/#/, "#");
  }

  if (!id || id === "#" || !isSelectorValid(id)) return;

  if (event) event.preventDefault();

  const element = document.querySelector(String(id));

  element?.scrollIntoView({
    block: "start",
    behavior: "smooth",
    inline: "start",
  });
};

const isSelectorValid = (selector: string | HTMLElement): boolean => {
  if (typeof selector === "string") {
    if (selector === "") return false;

    try {
      document.querySelector(selector);
      return true;
    } catch {
      return false;
    }
  } else {
    return document.body.contains(selector);
  }
};

{
  const handlePopState = () => {
    const match = window.location.hash.match(/#\/?(\w+)/);
    if (match) {
      smoothScrollTo(`#${match[1]}`);
    }
  };

  const handleClick = (event: MouseEvent) => {
    smoothScrollTo(event.target as HTMLElement, event);
  };

  window.addEventListener("popstate", handlePopState);
  window.addEventListener("click", handleClick);
}
