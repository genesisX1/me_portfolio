/** Run in the document head, before anchors or restored scroll can hide the intro. */
function startAtHome() {
  const w = window;
  try {
    w.history.scrollRestoration = 'manual';
  } catch {
    /* Optional browser facilities may be unavailable; retain the fallback behavior. */
  }
  let interacted = false;
  const scrollToTop = () => {
    const style = document.documentElement.style;
    const value = style.getPropertyValue('scroll-behavior');
    const priority = style.getPropertyPriority('scroll-behavior');
    style.setProperty('scroll-behavior', 'auto', 'important');
    w.scrollTo(0, 0);
    if (value) style.setProperty('scroll-behavior', value, priority);
    else style.removeProperty('scroll-behavior');
  };
  const reset = () => {
    // Preserve query parameters and framework history state; add no history entry.
    if (w.location.hash) {
      try {
        w.history.replaceState(w.history.state, '', w.location.pathname + w.location.search);
      } catch {
        /* Optional browser facilities may be unavailable; retain the fallback behavior. */
      }
    }
    scrollToTop();
    w.requestAnimationFrame(() => {
      if (!interacted && !w.location.hash) scrollToTop();
    });
  };
  for (const name of ['pointerdown', 'touchstart', 'wheel', 'keydown']) {
    w.addEventListener(
      name,
      () => {
        interacted = true;
      },
      { passive: true },
    );
  }
  reset();
  w.addEventListener('pageshow', (event) => {
    // A restored document does not remount React. Reset it here as well.
    if (event.persisted) {
      interacted = false;
      reset();
    } else if (!interacted && !w.location.hash) reset();
  });
}
export const homeEntryScript = `(${startAtHome.toString()})();`;
