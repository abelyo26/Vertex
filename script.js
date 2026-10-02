/* =========================================================
   Vertex Import & Export — interactions
   Mobile nav, smooth scrolling, active-section nav,
   scroll reveal, stat counters, form validation.
   ========================================================= */
(function () {
  'use strict';

  const prefersReducedMotion =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -----------------------------------------------------
     1. Current year in the footer
     ----------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  /* -----------------------------------------------------
     2. Theme toggle
     Light is the default. The inline script in <head> has
     already applied any saved choice before first paint, so
     all this does is flip and persist it.
     ----------------------------------------------------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');

  function currentTheme() {
    return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  function labelTheme() {
    if (!themeToggle) return;
    const dark = currentTheme() === 'dark';
    const word = themeToggle.dataset.labelTemplate || 'Switch to {theme} theme';
    themeToggle.setAttribute('aria-label', word.replace('{theme}', dark
      ? (themeToggle.dataset.light || 'light')
      : (themeToggle.dataset.dark || 'dark')));
    themeToggle.setAttribute('aria-pressed', String(dark));
    themeToggle.setAttribute('title', themeToggle.getAttribute('aria-label'));
    // keep the browser UI (address bar, scrollbars) in step
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', dark ? '#0b1220' : '#ffffff');
    root.style.colorScheme = dark ? 'dark' : 'light';
  }

  if (themeToggle) {
    labelTheme();

    themeToggle.addEventListener('click', function () {
      const next = currentTheme() === 'dark' ? 'light' : 'dark';

      // suppress every colour transition for one frame, or the whole
      // page cross-fades channel by channel and looks broken
      root.classList.add('theme-switching');

      if (next === 'dark') root.setAttribute('data-theme', 'dark');
      else root.setAttribute('data-theme', 'light');

      try { localStorage.setItem('vertex-theme', next); } catch (e) {}

      labelTheme();
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { root.classList.remove('theme-switching'); });
      });
    });
  }


  /* -----------------------------------------------------
     3. Mobile navigation
     ----------------------------------------------------- */
  const nav = document.getElementById('primaryNav');
  const navToggle = document.getElementById('navToggle');

  function closeNav() {
    if (!nav || !navToggle) return;
    nav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
    document.body.classList.remove('nav-open');
  }

  function openNav() {
    nav.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Close menu');
    document.body.classList.add('nav-open');
  }

  if (nav && navToggle) {
    navToggle.addEventListener('click', function () {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      isOpen ? closeNav() : openNav();
    });

    // close after picking a destination
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeNav();
    });

    // Esc closes it, and focus returns to the button
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
        closeNav();
        navToggle.focus();
      }
    });

    // clicking outside the panel closes it
    document.addEventListener('click', function (e) {
      if (navToggle.getAttribute('aria-expanded') !== 'true') return;
      if (nav.contains(e.target) || navToggle.contains(e.target)) return;
      closeNav();
    });

    // never leave the panel open when switching back to desktop
    window.matchMedia('(min-width: 861px)').addEventListener('change', function (e) {
      if (e.matches) closeNav();
    });
  }


  /* -----------------------------------------------------
     4. Smooth scrolling
     CSS `scroll-behavior: smooth` handles most of it; this
     adds URL-hash cleanliness, focus handling for keyboard
     users, and a fallback for browsers without it.
     ----------------------------------------------------- */
  const header = document.getElementById('siteHeader');
  const supportsCssSmooth = 'scrollBehavior' in document.documentElement.style;

  function headerOffset() {
    return header ? header.getBoundingClientRect().height + 16 : 88;
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const id = link.getAttribute('href');
      if (!id || id === '#') return;

      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();

      // lift the mobile scroll lock first, or the animation starts
      // while the body is still locked
      if (nav && nav.contains(link)) closeNav();

      if (supportsCssSmooth && !prefersReducedMotion) {
        // let CSS do the easing; scroll-padding-top keeps the header clear
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        const top =
          target.getBoundingClientRect().top + window.pageYOffset - headerOffset();
        window.scrollTo({ top: top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      }

      // keep the URL shareable without the browser's own jump
      if (history.replaceState) history.replaceState(null, '', id);

      // move keyboard focus into the section without re-scrolling
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      target.addEventListener('blur', function onBlur() {
        target.removeAttribute('tabindex');
        target.removeEventListener('blur', onBlur);
      });
    });
  });


  /* -----------------------------------------------------
     4b. Language links keep your place
     Both language pages use identical section ids, so we
     carry the current hash across. Read at click time,
     because the smooth-scroll handler updates the hash with
     replaceState, which fires no event.
     ----------------------------------------------------- */
  document.querySelectorAll('.lang-switch a, .footer-bottom a[hreflang]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const hash = window.location.hash;
      if (!hash || hash === '#') return;

      const base = (link.getAttribute('href') || '').split('#')[0];
      if (!base) return;

      e.preventDefault();
      window.location.href = base + hash;
    });
  });


  /* -----------------------------------------------------
     5. Header state + scroll progress bar
     ----------------------------------------------------- */
  const progress = document.getElementById('scrollProgress');
  let rafPending = false;

  function onScroll() {
    const y = window.pageYOffset;

    if (header) header.classList.toggle('scrolled', y > 12);

    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';
    }
    rafPending = false;
  }

  window.addEventListener(
    'scroll',
    function () {
      if (rafPending) return;
      rafPending = true;
      requestAnimationFrame(onScroll);
    },
    { passive: true }
  );
  onScroll();


  /* -----------------------------------------------------
     6. Active nav link for the section in view
     ----------------------------------------------------- */
  const navLinks = Array.prototype.slice.call(
    document.querySelectorAll('.nav-list a[href^="#"]')
  );
  const sections = navLinks
    .map(function (l) { return document.querySelector(l.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    const visible = new Map();

    const sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          visible.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        });

        // whichever tracked section occupies the most of the viewport wins
        let bestId = null;
        let bestRatio = 0;
        visible.forEach(function (ratio, id) {
          if (ratio > bestRatio) { bestRatio = ratio; bestId = id; }
        });

        navLinks.forEach(function (link) {
          link.classList.toggle(
            'active',
            bestId !== null && link.getAttribute('href') === '#' + bestId
          );
        });
      },
      {
        // discount the sticky header so the section under it isn't counted
        rootMargin: '-' + Math.round(headerOffset()) + 'px 0px -45% 0px',
        threshold: [0, 0.15, 0.35, 0.6, 0.85]
      }
    );

    sections.forEach(function (s) { sectionObserver.observe(s); });
  }


  /* -----------------------------------------------------
     7. Scroll reveal
     ----------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  } else {
    const revealObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('in');
          obs.unobserve(entry.target); // reveal once, then stop watching
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }


  /* -----------------------------------------------------
     8. Stat counters
     ----------------------------------------------------- */
  const counters = document.querySelectorAll('.counter');

  function runCounter(el) {
    const to = parseFloat(el.dataset.to || '0');

    if (prefersReducedMotion) {
      el.textContent = String(to);
      return;
    }

    const duration = 1400;
    const start = performance.now();

    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      el.textContent = String(Math.round(to * eased));
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if (counters.length) {
    if (!('IntersectionObserver' in window)) {
      counters.forEach(runCounter);
    } else {
      const counterObserver = new IntersectionObserver(
        function (entries, obs) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            runCounter(entry.target);
            obs.unobserve(entry.target);
          });
        },
        { threshold: 0.5 }
      );
      counters.forEach(function (c) { counterObserver.observe(c); });
    }
  }


  /* -----------------------------------------------------
     9. Quote form
     ----------------------------------------------------- */
  /* ------------------------------------------------------------------
     DELIVERY
     GitHub Pages only serves files, so it cannot send mail itself.
     Submissions post to Web3Forms, which forwards each one to
     verteximportexport.et@gmail.com (the address this key is registered
     to). Change the destination at https://web3forms.com by issuing a
     new key; it is not set anywhere in this file.

     The key is public by design. Web3Forms state it is not a secret:
     holding it only lets someone send mail TO that address, never read
     anything. It is therefore safe in this repository.

     Blank the key and the form falls back to opening the visitor's own
     email client with everything pre-filled, so it is never a silent
     dead end.
     ------------------------------------------------------------------ */
  const WEB3FORMS_KEY = 'a0e7e125-3a7f-492b-bbad-19cfc8aa99d0';
  const ENDPOINT = 'https://api.web3forms.com/submit';
  const FALLBACK_EMAIL = 'verteximportexport.et@gmail.com';

  const form = document.getElementById('quoteForm');
  const status = document.getElementById('formStatus');

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  /* Every visitor-facing string lives on the <form> as a data-
     attribute, so the English and Amharic pages can share this file. */
  function t(key, fallback) {
    return (form && form.dataset[key]) || fallback;
  }

  function setError(field, message) {
    const msgEl = form.querySelector('[data-error-for="' + field.name + '"]');
    if (msgEl) msgEl.textContent = message || '';
    if (message) field.setAttribute('aria-invalid', 'true');
    else field.removeAttribute('aria-invalid');
  }

  function validateField(field) {
    const value = field.value.trim();

    if (field.required && !value) {
      setError(field, t('errRequired', 'This field is required.'));
      return false;
    }
    if (field.type === 'email' && value && !EMAIL_RE.test(value)) {
      setError(field, t('errEmail', 'Enter a valid email address.'));
      return false;
    }
    if (field.name === 'message' && value && value.length < 12) {
      setError(field, t('errShort', 'Please add a little more detail.'));
      return false;
    }
    setError(field, '');
    return true;
  }

  /* kind: 'loading' | 'success' | 'error' | null (hide) */
  function say(message, kind, extraHtml) {
    if (!status) return;

    if (!message) {
      status.hidden = true;
      status.textContent = '';
      status.className = 'form-status';
      return;
    }

    status.className = 'form-status is-' + (kind || 'loading');
    status.textContent = message;
    if (extraHtml) status.insertAdjacentHTML('beforeend', extraHtml);
    status.hidden = false;
  }

  function setLoading(btn, on, label) {
    if (!btn) return;
    const text = btn.querySelector('.btn-label');
    btn.disabled = on;
    btn.classList.toggle('is-loading', on);
    if (!text) return;
    if (on) {
      btn.dataset.restore = text.textContent;
      text.textContent = label;
    } else if (btn.dataset.restore) {
      text.textContent = btn.dataset.restore;
    }
  }

  function mailtoFallback(data) {
    const body = [
      'Name: ' + (data.name || ''),
      'Company: ' + (data.company || ''),
      'Email: ' + (data.email || ''),
      'Phone: ' + (data.phone || ''),
      'Service: ' + (data.service || ''),
      'Route: ' + (data.route || ''),
      '',
      'Shipment details:',
      data.message || ''
    ].join('\n');

    window.location.href =
      'mailto:' + FALLBACK_EMAIL +
      '?subject=' + encodeURIComponent('Quote request: ' + (data.company || data.name || 'new enquiry')) +
      '&body=' + encodeURIComponent(body);
  }

  if (form) {
    const fields = Array.prototype.slice.call(
      form.querySelectorAll('input[required], textarea[required], input[type="email"]')
    );

    // clear an error as soon as the visitor starts fixing it
    fields.forEach(function (field) {
      field.addEventListener('blur', function () { validateField(field); });
      field.addEventListener('input', function () {
        if (field.getAttribute('aria-invalid') === 'true') validateField(field);
      });
    });

    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      // honeypot: only a bot fills a field it cannot see
      if (form.website && form.website.value) return;

      let firstInvalid = null;
      fields.forEach(function (field) {
        if (!validateField(field) && !firstInvalid) firstInvalid = field;
      });

      if (firstInvalid) {
        say(t('msgInvalid', 'Please check the highlighted fields.'), 'error');
        firstInvalid.focus();
        return;
      }

      const data = Object.fromEntries(new FormData(form).entries());
      delete data.website;

      const submitBtn = form.querySelector('button[type="submit"]');

      // No key configured: hand the enquiry to the visitor's mail client
      // rather than pretending it was sent.
      if (!WEB3FORMS_KEY) {
        say(t('msgSending', 'Opening your email client…'), 'loading');
        mailtoFallback(data);
        return;
      }

      // An offline browser produces the same opaque "Failed to fetch" as a
      // blocked request, so name the real cause while we can.
      if (navigator.onLine === false) {
        say(t('msgOffline', 'You appear to be offline. Check your connection and try again.'), 'error');
        return;
      }

      setLoading(submitBtn, true, t('btnSending', 'Sending…'));
      say(t('msgSending', 'Sending your request…'), 'loading');

      /* Sent as FormData, not JSON. A JSON body sets Content-Type:
         application/json, which makes this a non-simple cross-origin
         request and forces a CORS preflight; Web3Forms answers OPTIONS
         with 403 and no CORS headers, so any preflight that is not
         waved through fails the whole request. FormData is a simple
         request and skips the preflight entirely. Accept is on the
         CORS safelist, so it does not reintroduce one. Do not set
         Content-Type here: the browser must add the multipart
         boundary itself. */
      const payload = new FormData(form);
      payload.delete('website');                   // honeypot, never sent
      payload.append('access_key', WEB3FORMS_KEY);
      payload.append('subject', 'Quote request: ' + (data.company || data.name || 'new enquiry'));
      payload.append('from_name', 'Vertex website');
      payload.append('replyto', data.email);       // one word, per the Web3Forms API
      payload.append('page_language', document.documentElement.lang || 'en');

      try {
        const res = await fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: payload
        });

        // Web3Forms documents the message at body.message but its own
        // example reads it at the top level, so check both.
        let json = {};
        try { json = await res.json(); } catch (e) {}
        const ok = res.ok && json.success !== false;

        if (!ok) {
          const detail = json.message || (json.body && json.body.message) || ('status ' + res.status);
          throw new Error(detail);
        }

        form.reset();
        say(t('msgSuccess', 'Thank you, your request is in.'), 'success');
      } catch (err) {
        // Keep what they typed, and always offer a way through that does
        // not depend on this request working.
        say(t('msgError', 'We could not send that.'), 'error',
            ' <a href="mailto:' + FALLBACK_EMAIL + '">' + FALLBACK_EMAIL + '</a>');
        if (window.console) console.error('[Vertex form]', err);
      } finally {
        setLoading(submitBtn, false);
      }
    });
  }
})();
