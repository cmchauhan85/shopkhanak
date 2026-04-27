(function () {
  const STORAGE_KEY = 'khanak_wishlist';

  function readWishlist() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function writeWishlist(list) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {}
  }

  function isWished(handle) {
    return readWishlist().indexOf(handle) !== -1;
  }

  function toggle(handle) {
    const list = readWishlist();
    const idx = list.indexOf(handle);
    if (idx === -1) {
      list.push(handle);
    } else {
      list.splice(idx, 1);
    }
    writeWishlist(list);
    return idx === -1;
  }

  function syncButton(button) {
    const handle = button.getAttribute('data-handle');
    if (!handle) return;
    const wished = isWished(handle);
    button.classList.toggle('is-wished', wished);
    button.setAttribute('aria-pressed', wished ? 'true' : 'false');
  }

  function init() {
    const buttons = document.querySelectorAll('[data-wishlist-button]');
    buttons.forEach(function (button) {
      syncButton(button);
      button.addEventListener('click', function (event) {
        event.preventDefault();
        const handle = button.getAttribute('data-handle');
        if (!handle) return;
        const wished = toggle(handle);
        button.classList.toggle('is-wished', wished);
        button.setAttribute('aria-pressed', wished ? 'true' : 'false');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
