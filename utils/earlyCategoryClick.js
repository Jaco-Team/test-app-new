import { isCityHomePath } from '@/utils/categoryNavigation';

// Этот обработчик выполняется до загрузки React; он не должен иметь зависимостей.
function installEarlyCategoryClickGuard() {
  var pending = null;
  var observer = null;
  var resumeTimer = null;
  var expiryTimer = null;

  function isHome(city) {
    try {
      return (
        decodeURIComponent(window.location.pathname)
          .replace(/\/+$/, '')
          .toLowerCase() ===
        '/' + city.toLowerCase()
      );
    } catch (error) {
      return false;
    }
  }

  function clearPending() {
    pending = null;
    if (observer) observer.disconnect();
    observer = null;
    window.clearTimeout(resumeTimer);
    window.clearTimeout(expiryTimer);
  }
  window.__jacoCancelEarlyCategoryClick = clearPending;

  function findReadyLink() {
    if (!pending || !isHome(pending.city)) return null;
    var target =
      document.getElementById(pending.target) ||
      document.getElementsByName(pending.target)[0];
    if (!target || !target.getClientRects().length) return null;
    var links = document.querySelectorAll('a[data-home-category]');
    for (var i = 0; i < links.length; i++) {
      if (
        links[i].getAttribute('data-home-category') === pending.city &&
        links[i].getAttribute('data-category-target') === pending.target &&
        links[i].getAttribute('data-category-ready') === 'true' &&
        links[i].getClientRects().length
      )
        return links[i];
    }
    return null;
  }

  function resumeWhenReady() {
    window.clearTimeout(resumeTimer);
    if (!pending) return;
    if (!isHome(pending.city)) {
      clearPending();
      delete window.__jacoHomeCategorySelection;
      return;
    }
    if (!findReadyLink()) return;
    // Даём завершиться первичной инициализации каталога и его раскладки.
    resumeTimer = window.setTimeout(function () {
      var link = findReadyLink();
      if (!link) return;
      clearPending();
      link.click();
    }, 150);
  }

  document.addEventListener(
    'click',
    function (event) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      var link =
        event.target && event.target.closest
          ? event.target.closest('a[href]')
          : null;
      if (
        !link ||
        link.hasAttribute('download') ||
        (link.target && link.target !== '_self')
      )
        return;
      var city = link.getAttribute('data-home-category');
      var targetId = link.getAttribute('data-category-target');
      if (!city || !/^cat\d+$/.test(targetId || '') || !isHome(city)) {
        if (link.pathname !== window.location.pathname) {
          clearPending();
          delete window.__jacoHomeCategorySelection;
        }
        return;
      }
      // Даже готовый клик может опередить начальный scrollTo(0, 0) страницы.
      window.__jacoHomeCategorySelection = { city: city, target: targetId };
      var target =
        document.getElementById(targetId) ||
        document.getElementsByName(targetId)[0];
      if (
        link.getAttribute('data-category-ready') === 'true' &&
        target &&
        target.getClientRects().length
      ) {
        clearPending();
        return;
      }
      event.preventDefault();
      event.__jacoEarlyCategoryClick = true;
      clearPending();
      pending = { city: city, target: targetId };
      observer = new MutationObserver(resumeWhenReady);
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['data-category-ready'],
      });
      expiryTimer = window.setTimeout(clearPending, 30000);
      resumeWhenReady();
    },
    true
  );

  window.addEventListener('popstate', function () {
    clearPending();
    delete window.__jacoHomeCategorySelection;
  });
  window.addEventListener('pagehide', clearPending);
}

export const earlyCategoryClickScript = `(${installEarlyCategoryClickGuard.toString()})();`;

export function hasHomeCategorySelection(city) {
  return (
    typeof window !== 'undefined' &&
    window.__jacoHomeCategorySelection?.city === city
  );
}

export function isEarlyCategoryClick(event) {
  return event.nativeEvent?.__jacoEarlyCategoryClick === true;
}

export function clearHomeCategorySelectionOnNavigation(url) {
  if (typeof window === 'undefined') return;
  const selection = window.__jacoHomeCategorySelection;
  if (selection && !isCityHomePath(url, selection.city)) {
    window.__jacoCancelEarlyCategoryClick?.();
    delete window.__jacoHomeCategorySelection;
  }
}
