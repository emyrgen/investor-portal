// Sticky nav
  const nav = document.getElementById('main-nav');
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  window.addEventListener('scroll', () => {
    const isScrolled = window.scrollY > 60;
    nav.classList.toggle('scrolled', isScrolled);
    if (scrollTopBtn) scrollTopBtn.classList.toggle('show', window.scrollY > 300);
  });
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Intersection observer for section animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.pillar, .step, .product-card, .market-card, .lspec, .compliance-item, .achievement-item, .whynow-card, .offer-tile').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // Accordion galleries / mobile scrollers
  document.querySelectorAll('.conversion-gallery-track').forEach((galleryTrack) => {
    const gallerySlides = Array.from(galleryTrack.querySelectorAll('.gallery-slide'));
    const setActiveSlide = (slide) => {
      gallerySlides.forEach(item => item.classList.toggle('is-active', item === slide));
    };

    gallerySlides.forEach((slide) => {
      slide.addEventListener('click', () => setActiveSlide(slide));
      slide.addEventListener('focus', () => setActiveSlide(slide));
      slide.addEventListener('mouseenter', () => {
        if (window.innerWidth > 860) setActiveSlide(slide);
      });
      slide.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          setActiveSlide(slide);
        }
      });
    });
  });

  const heroAirframeCarousel = document.querySelector('.hero-airframe-carousel');
  if (heroAirframeCarousel) {
    const heroAirframeSlides = Array.from(heroAirframeCarousel.querySelectorAll('.hero-airframe-slide'));
    const heroAirframePrev = heroAirframeCarousel.querySelector('.hero-airframe-control.prev');
    const heroAirframeNext = heroAirframeCarousel.querySelector('.hero-airframe-control.next');
    const heroAirframeToggle = heroAirframeCarousel.querySelector('.hero-airframe-play-toggle');
    const heroAirframeReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let heroAirframeIndex = Math.max(0, heroAirframeSlides.findIndex(slide => slide.classList.contains('is-active')));
    let heroAirframeTimer = null;
    let heroAirframePausedByUser = false;
    const heroAirframeDelay = 1800;

    const heroAirframeRender = () => {
      heroAirframeSlides.forEach((slide, index) => {
        const isActive = index === heroAirframeIndex;
        slide.classList.toggle('is-active', isActive);
        slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');
      });
    };

    const heroAirframeStop = () => {
      if (heroAirframeTimer) {
        window.clearInterval(heroAirframeTimer);
        heroAirframeTimer = null;
      }
    };

    const heroAirframeStart = () => {
      if (heroAirframePausedByUser || heroAirframeReducedMotion || heroAirframeSlides.length < 2) return;
      heroAirframeStop();
      heroAirframeTimer = window.setInterval(() => {
        heroAirframeIndex = (heroAirframeIndex + 1) % heroAirframeSlides.length;
        heroAirframeRender();
      }, heroAirframeDelay);
    };

    const heroAirframeGoTo = (nextIndex, userInitiated = false) => {
      heroAirframeIndex = (nextIndex + heroAirframeSlides.length) % heroAirframeSlides.length;
      heroAirframeRender();
      if (userInitiated && !heroAirframePausedByUser) {
        heroAirframeStart();
      }
    };

    heroAirframePrev?.addEventListener('click', () => heroAirframeGoTo(heroAirframeIndex - 1, true));
    heroAirframeNext?.addEventListener('click', () => heroAirframeGoTo(heroAirframeIndex + 1, true));

    heroAirframeToggle?.addEventListener('click', () => {
      heroAirframePausedByUser = !heroAirframePausedByUser;
      heroAirframeToggle.classList.toggle('is-paused', heroAirframePausedByUser);
      heroAirframeToggle.setAttribute('aria-pressed', heroAirframePausedByUser ? 'true' : 'false');
      heroAirframeToggle.setAttribute('aria-label', heroAirframePausedByUser ? 'Resume gallery autoplay' : 'Pause gallery autoplay');
      if (heroAirframePausedByUser) {
        heroAirframeStop();
      } else {
        heroAirframeStart();
      }
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        heroAirframeStop();
      } else if (!heroAirframePausedByUser) {
        heroAirframeStart();
      }
    });

    heroAirframeRender();
    heroAirframeStart();
  }

  // Mobile navigation menu
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  if (mobileMenuToggle && mobileMenu) {
    const setMobileMenuOpen = (isOpen) => {
      mobileMenuToggle.classList.toggle('is-open', isOpen);
      mobileMenu.classList.toggle('is-open', isOpen);
      mobileMenuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      mobileMenu.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    };

    mobileMenuToggle.addEventListener('click', () => {
      setMobileMenuOpen(!mobileMenu.classList.contains('is-open'));
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setMobileMenuOpen(false));
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) setMobileMenuOpen(false);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') setMobileMenuOpen(false);
    });
  }

  // Form handler
  function handleSubmit(e) {
    e.preventDefault();
    const btn = e.target.querySelector('.form-submit');
    btn.textContent = 'Preparing Email...';
    btn.style.background = 'var(--c-accent)';
    const data = new FormData(e.target);
    const subject = encodeURIComponent(`EMYRGEN SAFE Package Request — ${data.get('name')}`);
    const body = encodeURIComponent(
      `Name: ${data.get('name')}\n` +
      `Relationship / Organization: ${data.get('company')}\n` +
      `Email: ${data.get('email')}\n` +
      `Request Type: ${data.get('inquiry_type')}\n` +
      `Approximate Amount: ${data.get('amount')}\n\n` +
      `${data.get('message')}`
    );
    setTimeout(() => {
      btn.textContent = 'Opening Email ✓';
      btn.style.background = 'var(--c-green)';
      window.location.href = `mailto:invest@emyrgengroup.com?subject=${subject}&body=${body}`;
    }, 900);
  }

(function () {
  const AGREEMENT_URL = 'emyrgen-investment-agreement.pdf';
  const INVEST_EMAIL = 'invest@emyrgengroup.com';
  const form = document.getElementById('simpleInvestorForm');
  if (!form) return;

  const nameEl = document.getElementById('simpleInvestorName');
  const emailEl = document.getElementById('simpleInvestorEmail');
  const phoneEl = document.getElementById('simpleInvestorPhone');
  const statusEl = document.getElementById('simpleSignupStatus');
  const signedCta = document.getElementById('emailSignedAgreementCta');

  function clean(value) { return String(value || '').trim(); }
  function setStatus(message, isError) {
    if (!statusEl) return;
    statusEl.hidden = false;
    statusEl.textContent = message;
    statusEl.classList.toggle('is-error', !!isError);
  }
  function setError(el, show) {
    if (el) el.classList.toggle('is-error', !!show);
  }
  function buildSignedMailto(name, email, phone) {
    const subject = 'Signed EMYRGEN Investment Agreement';
    const contact = [email, phone].filter(Boolean).join(' / ');
    const body = [
      'Hello EMYRGEN,',
      '',
      'Attached is my completed and signed EMYRGEN Investment Agreement.',
      '',
      `Investor name: ${name || ''}`,
      `Contact email or phone: ${contact || ''}`,
      '',
      'Thank you.'
    ].join('\n');
    return `mailto:${INVEST_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }
  function triggerDownload() {
    const a = document.createElement('a');
    a.href = AGREEMENT_URL;
    a.download = 'EMYRGEN_Investment_Agreement.pdf';
    a.target = '_blank';
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    const name = clean(nameEl && nameEl.value);
    const email = clean(emailEl && emailEl.value);
    const phone = clean(phoneEl && phoneEl.value);
    const hasContact = !!(email || phone);
    setError(nameEl, !name);
    setError(emailEl, !hasContact);
    setError(phoneEl, !hasContact);
    if (!name || !hasContact) {
      setStatus('Enter your full name and at least one contact method.', true);
      return;
    }

    if (signedCta) signedCta.href = buildSignedMailto(name, email, phone);
    triggerDownload();
    if (statusEl) {
      statusEl.hidden = true;
      statusEl.textContent = '';
      statusEl.classList.remove('is-error');
    }
  });
})();

(function () {
  function initReliableAirframeSwipe() {
    var carousel = document.getElementById('heroAirframeCarousel');
    if (!carousel || carousel.dataset.reliableSwipeReady === 'true') return;

    var stage = carousel.closest('.hero-airframe-stage') || carousel;
    var frame = carousel.closest('.hero-airframe-frame') || stage;
    var swipeTarget = frame || stage || carousel;

    var slides = Array.prototype.slice.call(carousel.querySelectorAll('.hero-airframe-slide'));
    if (!slides.length) return;

    carousel.dataset.reliableSwipeReady = 'true';

    var startX = 0;
    var startY = 0;
    var lastX = 0;
    var lastY = 0;
    var tracking = false;
    var movedHorizontally = false;
    var threshold = 36;

    function activeIndex() {
      var active = carousel.querySelector('.hero-airframe-slide.is-active');
      var idx = slides.indexOf(active);
      return idx >= 0 ? idx : 0;
    }

    function activate(index) {
      var total = slides.length;
      var next = ((index % total) + total) % total;

      slides.forEach(function (slide, i) {
        var on = i === next;
        slide.classList.toggle('is-active', on);
        slide.setAttribute('aria-hidden', on ? 'false' : 'true');
      });

      // Store the active index on the DOM so any other site code can read it.
      carousel.dataset.activeIndex = String(next);
      stage.dataset.activeIndex = String(next);

      // Dispatch an event in case other code needs to react.
      try {
        carousel.dispatchEvent(new CustomEvent('airframeSlideChange', { detail: { index: next } }));
      } catch (e) {}
    }

    function nextSlide() {
      activate(activeIndex() + 1);
    }

    function previousSlide() {
      activate(activeIndex() - 1);
    }

    function begin(x, y) {
      startX = x;
      startY = y;
      lastX = x;
      lastY = y;
      tracking = true;
      movedHorizontally = false;
      stage.classList.add('is-swipe-dragging');
    }

    function move(x, y, event) {
      if (!tracking) return;

      lastX = x;
      lastY = y;

      var dx = x - startX;
      var dy = y - startY;

      if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) {
        movedHorizontally = true;
        if (event && event.cancelable) event.preventDefault();
      }
    }

    function end(x, y) {
      if (!tracking) return;

      var dx = (typeof x === 'number' ? x : lastX) - startX;
      var dy = (typeof y === 'number' ? y : lastY) - startY;

      tracking = false;
      stage.classList.remove('is-swipe-dragging');

      if (Math.abs(dx) >= threshold && Math.abs(dx) > Math.abs(dy) * 1.2) {
        if (dx < 0) {
          nextSlide();
        } else {
          previousSlide();
        }
      }

      window.setTimeout(function () {
        movedHorizontally = false;
      }, 0);
    }

    // Mobile-first touch handling.
    swipeTarget.addEventListener('touchstart', function (e) {
      if (!e.touches || e.touches.length !== 1) return;
      var t = e.touches[0];
      begin(t.clientX, t.clientY);
    }, { passive: true });

    swipeTarget.addEventListener('touchmove', function (e) {
      if (!e.touches || e.touches.length !== 1) return;
      var t = e.touches[0];
      move(t.clientX, t.clientY, e);
    }, { passive: false });

    swipeTarget.addEventListener('touchend', function (e) {
      var t = e.changedTouches && e.changedTouches[0];
      end(t ? t.clientX : lastX, t ? t.clientY : lastY);
    }, { passive: true });

    swipeTarget.addEventListener('touchcancel', function () {
      tracking = false;
      stage.classList.remove('is-swipe-dragging');
    }, { passive: true });

    // Pointer/mouse support for desktop and touch-screen laptops.
    swipeTarget.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'touch') return; // touch handled above
      if (e.button !== undefined && e.button !== 0) return;
      begin(e.clientX, e.clientY);
      try { swipeTarget.setPointerCapture(e.pointerId); } catch (err) {}
    });

    swipeTarget.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'touch') return;
      move(e.clientX, e.clientY, e);
    });

    swipeTarget.addEventListener('pointerup', function (e) {
      if (e.pointerType === 'touch') return;
      end(e.clientX, e.clientY);
      try { swipeTarget.releasePointerCapture(e.pointerId); } catch (err) {}
    });

    swipeTarget.addEventListener('pointercancel', function () {
      tracking = false;
      stage.classList.remove('is-swipe-dragging');
    });

    // Trackpad horizontal gesture support.
    swipeTarget.addEventListener('wheel', function (e) {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 28) {
        e.preventDefault();
        if (e.deltaX > 0) nextSlide();
        else previousSlide();
      }
    }, { passive: false });

    swipeTarget.addEventListener('click', function (e) {
      if (movedHorizontally) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReliableAirframeSwipe);
  } else {
    initReliableAirframeSwipe();
  }
})();
