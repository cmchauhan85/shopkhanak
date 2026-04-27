if (!customElements.get('floating-buy-bar')) {
  class FloatingBuyBar extends HTMLElement {
    constructor() {
      super();
      this.buyButtonsEl = null;
      this.observer = null;
      this.qtyInput = null;
      this.addToCartBtn = null;
      this.buyNowBtn = null;
    }

    connectedCallback() {
      this.qtyInput = this.querySelector('.floating-buy-bar__qty-input');
      this.addToCartBtn = this.querySelector('[data-action="add-to-cart"]');
      this.buyNowBtn = this.querySelector('[data-action="buy-now"]');

      const sectionId = this.dataset.sectionId;
      this.productFormId = 'product-form-' + sectionId;
      this.buyButtonsEl = document.querySelector('#ProductSubmitButton-' + sectionId);

      this.bindQty();
      this.bindActions();
      this.bindObserver();
      this.subscribeToVariantChange(sectionId);
    }

    bindQty() {
      const minus = this.querySelector('[name="minus"]');
      const plus = this.querySelector('[name="plus"]');
      if (minus) {
        minus.addEventListener('click', () => {
          const v = parseInt(this.qtyInput.value, 10) || 1;
          if (v > 1) this.qtyInput.value = v - 1;
        });
      }
      if (plus) {
        plus.addEventListener('click', () => {
          const v = parseInt(this.qtyInput.value, 10) || 1;
          this.qtyInput.value = v + 1;
        });
      }
    }

    bindActions() {
      const form = document.getElementById(this.productFormId);
      if (!form) return;

      const setQty = () => {
        const mainQty = document.querySelector('#Quantity-' + this.dataset.sectionId);
        if (mainQty) mainQty.value = this.qtyInput.value;
      };

      if (this.addToCartBtn) {
        this.addToCartBtn.addEventListener('click', () => {
          setQty();
          const submit = form.querySelector('[type="submit"]');
          if (submit) submit.click();
        });
      }

      if (this.buyNowBtn) {
        this.buyNowBtn.addEventListener('click', () => {
          setQty();
          const dynamic = form.querySelector('.shopify-payment-button__button--unbranded, .shopify-payment-button__button');
          if (dynamic) {
            dynamic.click();
          } else {
            form.action = '/cart';
            form.submit();
          }
        });
      }
    }

    bindObserver() {
      if (!this.buyButtonsEl || !('IntersectionObserver' in window)) {
        this.show();
        return;
      }
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.hide();
            } else if (entry.boundingClientRect.top < 0) {
              this.show();
            } else {
              this.hide();
            }
          });
        },
        { rootMargin: '0px 0px -10% 0px', threshold: 0 }
      );
      this.observer.observe(this.buyButtonsEl);
    }

    subscribeToVariantChange(sectionId) {
      if (typeof subscribe !== 'function' || typeof PUB_SUB_EVENTS === 'undefined') return;
      try {
        subscribe(PUB_SUB_EVENTS.variantChange, (payload) => {
          if (!payload || !payload.data) return;
          if (String(payload.data.sectionId) !== String(sectionId)) return;
          const variant = payload.data.variant;
          const available = variant && variant.available;
          if (this.addToCartBtn) this.addToCartBtn.disabled = !available;
          if (this.buyNowBtn) this.buyNowBtn.disabled = !available;
        });
      } catch (e) {}
    }

    show() {
      this.hidden = false;
      this.classList.add('is-visible');
    }

    hide() {
      this.classList.remove('is-visible');
      this.hidden = true;
    }
  }

  customElements.define('floating-buy-bar', FloatingBuyBar);
}
