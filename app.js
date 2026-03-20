/* ================================================
   SITELIFT — App JavaScript
   Theme toggle, mobile menu, scroll effects, animations
   ================================================ */

(function () {
  'use strict';

  // --- Theme Toggle ---
  const toggle = document.querySelector('[data-theme-toggle]');
  const root = document.documentElement;

  // Default to dark
  let currentTheme = 'dark';
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    // Respect system preference but default to dark as per design
    currentTheme = 'dark';
  }
  root.setAttribute('data-theme', currentTheme);
  updateToggleIcon();

  if (toggle) {
    toggle.addEventListener('click', () => {
      currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', currentTheme);
      toggle.setAttribute('aria-label', `Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} mode`);
      updateToggleIcon();
    });
  }

  function updateToggleIcon() {
    if (!toggle) return;
    if (currentTheme === 'dark') {
      toggle.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
    } else {
      toggle.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    }
  }

  // --- Mobile Menu ---
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', isOpen);
      mobileNav.setAttribute('aria-hidden', !isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close mobile nav on link click
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Header scroll effect ---
  const header = document.getElementById('header');
  let lastScrollY = 0;

  function onScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 50) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
    lastScrollY = scrollY;
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // --- Scroll Reveal Fallback (for browsers without scroll-driven animations) ---
  if (!CSS.supports('animation-timeline: scroll()')) {
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => el.classList.add('js-reveal'));

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    fadeElements.forEach(el => observer.observe(el));
  }

  // --- Sticky CTA Bar ---
  const stickyCta = document.getElementById('stickyCta');
  const heroSection = document.getElementById('hero');
  const contactSection = document.getElementById('contact');

  if (stickyCta && heroSection && contactSection) {
    const ctaObserver = new IntersectionObserver((entries) => {
      // We track both hero and contact sections
      entries.forEach(entry => {
        updateStickyCta();
      });
    }, { threshold: 0.1 });

    let heroVisible = true;
    let contactVisible = false;

    const heroObserver = new IntersectionObserver((entries) => {
      heroVisible = entries[0].isIntersecting;
      updateStickyCta();
    }, { threshold: 0.1 });

    const contactObserver = new IntersectionObserver((entries) => {
      contactVisible = entries[0].isIntersecting;
      updateStickyCta();
    }, { threshold: 0.1 });

    function updateStickyCta() {
      if (!heroVisible && !contactVisible) {
        stickyCta.classList.add('is-visible');
      } else {
        stickyCta.classList.remove('is-visible');
      }
    }

    heroObserver.observe(heroSection);
    contactObserver.observe(contactSection);
  }

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();
