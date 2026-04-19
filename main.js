/* =========================================================
   SOLUVEX v3 — main.js
   Sticky-stack clip reveal + Lenis + GSAP + i18n
   ========================================================= */

(() => {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------
     i18n
     --------------------------------------------------------- */
  const WA_URLS = {
    en: 'https://wa.me/34644804698?text=Hi%2C%20I%27d%20like%20to%20discuss%20a%20project.',
    es: 'https://wa.me/34644804698?text=Hola%2C%20me%20gustar%C3%ADa%20hablar%20de%20un%20proyecto.'
  };

  const dict = {
    en: {
      'meta.title': 'Soluvex — Websites that demand attention',
      'meta.description': "Premium websites and AI automations for brands that can't afford to look ordinary. By Sergio Medina.",
      'a11y.skip': 'Skip to content',

      'hero.title.l1': 'Websites that',
      'hero.title.l2': 'demand attention.',
      'hero.lead': "Premium websites & AI automations. For brands that can't afford to look ordinary.",

      'work.label': 'Selected work',
      'work.carat.tag': 'Luxury Concierge · Ibiza',
      'work.cristina.tag': 'Aesthetic Medicine · Ibiza',
      'work.more': 'More projects coming.',

      's1.num': '/01',
      's1.title': 'WEBSITES',
      's1.desc': 'Every website is a visual argument. Designed to convince before they read a single line.',
      's1.tags': '[ EDITORIAL DESIGN ] — [ GSAP ANIMATIONS ] — [ TECHNICAL SEO ] — [ FULL DEPLOY ] — [ EDITORIAL DESIGN ] — [ GSAP ANIMATIONS ] — [ TECHNICAL SEO ] — [ FULL DEPLOY ] —',
      's1.cta': "Let's talk about your website →",
      's2.num': '/02',
      's2.title': 'AI AUTOMATIONS',
      's2.desc': 'Flows that work while you sleep. Your business responding, qualifying and closing on its own.',
      's2.tags': '[ WHATSAPP AGENTS ] — [ LEAD QUALIFICATION ] — [ CUSTOM GPT ] — [ INTERNAL AUTOMATION ] — [ WHATSAPP AGENTS ] — [ LEAD QUALIFICATION ] — [ CUSTOM GPT ] — [ INTERNAL AUTOMATION ] —',
      's2.cta': "Let's talk about your automation →",

      'about.p1': 'Soluvex is a one-person studio run by Sergio Medina, based between the Canary Islands and Ibiza.',
      'about.p2': "I build websites and AI automations for premium brands — the kind that can't afford to look ordinary.",
      'about.p3': 'Every project led by me. From first conversation to final deploy. No handoffs. No templates. No agency theatre.',
      'about.caption': 'Sergio Medina — Founder, Soluvex',

      'contact.title.l1': "Let's build",
      'contact.title.l2': 'something real.',
      'contact.cta': 'Start a project →',

      'footer.legal': 'Legal notice',
      'footer.privacy': 'Privacy',
      'footer.cookies': 'Cookies'
    },
    es: {
      'meta.title': 'Soluvex — Webs que exigen atención',
      'meta.description': 'Webs premium y automatizaciones IA para marcas que no pueden permitirse parecer ordinarias. Por Sergio Medina.',
      'a11y.skip': 'Saltar al contenido',

      'hero.title.l1': 'Webs que',
      'hero.title.l2': 'exigen atención.',
      'hero.lead': 'Webs premium y automatizaciones IA. Para marcas que no pueden permitirse parecer ordinarias.',

      'work.label': 'Trabajo seleccionado',
      'work.carat.tag': 'Concierge de Lujo · Ibiza',
      'work.cristina.tag': 'Medicina Estética · Ibiza',
      'work.more': 'Más proyectos llegando.',

      's1.num': '/01',
      's1.title': 'WEBS',
      's1.desc': 'Cada web es un argumento visual. Diseñada para convencer antes de que lean una sola línea.',
      's1.tags': '[ DISEÑO EDITORIAL ] — [ ANIMACIONES GSAP ] — [ SEO TÉCNICO ] — [ DEPLOY INCLUIDO ] — [ DISEÑO EDITORIAL ] — [ ANIMACIONES GSAP ] — [ SEO TÉCNICO ] — [ DEPLOY INCLUIDO ] —',
      's1.cta': 'Hablemos de tu web →',
      's2.num': '/02',
      's2.title': 'AUTOMATIZACIONES IA',
      's2.desc': 'Flujos que trabajan mientras duermes. Tu negocio respondiendo, calificando y cerrando solo.',
      's2.tags': '[ AGENTES WHATSAPP ] — [ CUALIFICACIÓN DE LEADS ] — [ GPT A MEDIDA ] — [ AUTOMATIZACIÓN INTERNA ] — [ AGENTES WHATSAPP ] — [ CUALIFICACIÓN DE LEADS ] — [ GPT A MEDIDA ] — [ AUTOMATIZACIÓN INTERNA ] —',
      's2.cta': 'Hablemos de tu automatización →',

      'about.p1': 'Soluvex es un estudio unipersonal dirigido por Sergio Medina, entre Canarias e Ibiza.',
      'about.p2': 'Construyo webs y automatizaciones IA para marcas premium — las que no pueden permitirse parecer ordinarias.',
      'about.p3': 'Cada proyecto lo llevo yo. Desde la primera conversación hasta el deploy final. Sin intermediarios. Sin plantillas. Sin teatro de agencia.',
      'about.caption': 'Sergio Medina — Fundador, Soluvex',

      'contact.title.l1': 'Construyamos',
      'contact.title.l2': 'algo real.',
      'contact.cta': 'Empezar un proyecto →',

      'footer.legal': 'Aviso Legal',
      'footer.privacy': 'Privacidad',
      'footer.cookies': 'Cookies'
    }
  };

  const LANG_KEY = 'soluvex.lang';
  let currentLang = (() => {
    const saved = localStorage.getItem(LANG_KEY);
    return (saved === 'en' || saved === 'es') ? saved : 'en';
  })();
  let firstRender = true;

  function splitIntoWords(container) {
    container.querySelectorAll('[data-line]').forEach((line) => {
      const text = (line.textContent || '').trim();
      const words = text.split(/\s+/);
      line.innerHTML = words
        .map((w) => `<span class="word-wrap"><span class="word">${escapeHTML(w)}</span></span>`)
        .join(' ');
    });
  }
  function escapeHTML(s) {
    return s.replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[c]);
  }

  function applyLang(lang) {
    const t = dict[lang];
    if (!t) return;
    currentLang = lang;
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (!(key in t)) return;
      const attr = el.getAttribute('data-i18n-attr');
      if (attr) el.setAttribute(attr, t[key]);
      else el.textContent = t[key];
    });

    const titleEl = document.querySelector('title[data-i18n]');
    if (titleEl) document.title = t[titleEl.getAttribute('data-i18n')] || document.title;

    document.querySelectorAll('[data-wa]').forEach((a) => a.setAttribute('href', WA_URLS[lang]));

    document.querySelectorAll('[data-lang-opt]').forEach((el) => {
      el.classList.toggle('is-active', el.getAttribute('data-lang-opt') === lang);
    });

    // Rebuild word spans after text changes
    document.querySelectorAll('[data-words-split]').forEach(splitIntoWords);

    // If language changed mid-session, ensure words are fully visible (don't re-animate entrance)
    if (!firstRender) {
      document.querySelectorAll('[data-words-split] .word').forEach((w) => {
        w.style.opacity = '1';
        w.style.transform = 'none';
      });
    }

    localStorage.setItem(LANG_KEY, lang);
  }

  function bindLangToggle() {
    const btn = document.querySelector('[data-lang-toggle]');
    if (!btn) return;
    btn.addEventListener('click', () => {
      applyLang(currentLang === 'en' ? 'es' : 'en');
    });
  }

  /* ---------------------------------------------------------
     Year
     --------------------------------------------------------- */
  function setYear() {
    const y = new Date().getFullYear();
    document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = y; });
  }

  /* ---------------------------------------------------------
     WhatsApp float fade-in
     --------------------------------------------------------- */
  function scheduleFloatButton() {
    const el = document.querySelector('[data-wa-float]');
    if (!el) return;
    setTimeout(() => el.classList.add('is-visible'), 2000);
  }

  /* ---------------------------------------------------------
     Section navigation arrows (hero)
     --------------------------------------------------------- */
  // All sections in normal flow, each min-height 100vh.
  // Order: hero → work → services-web → services-ai → about → contact.
  // Services has two full-viewport panels; each is a navigable step.
  const PANEL_SCROLL_VH = [0, 100, 200, 300, 400, 500];

  function currentPanelIndex() {
    const vh = window.innerHeight;
    const s = window.scrollY;
    if (s < vh * 0.5) return 0; // hero
    if (s < vh * 1.5) return 1; // work
    if (s < vh * 2.5) return 2; // services-web
    if (s < vh * 3.5) return 3; // services-ai
    if (s < vh * 4.5) return 4; // about
    return 5;                   // contact
  }

  function bindSectionNav(lenis) {
    const ups   = document.querySelectorAll('[data-nav-arrow="up"]');
    const downs = document.querySelectorAll('[data-nav-arrow="down"]');
    if (!ups.length && !downs.length) return;

    const scrollToIndex = (i) => {
      i = Math.max(0, Math.min(PANEL_SCROLL_VH.length - 1, i));
      const target = PANEL_SCROLL_VH[i] * window.innerHeight / 100;
      if (lenis) lenis.scrollTo(target, { duration: 1.4 });
      else window.scrollTo({ top: target, behavior: 'smooth' });
    };

    ups.forEach((b) => b.addEventListener('click', () => scrollToIndex(currentPanelIndex() - 1)));
    downs.forEach((b) => b.addEventListener('click', () => scrollToIndex(currentPanelIndex() + 1)));

    const updateDisabled = () => {
      const i = currentPanelIndex();
      ups.forEach((b) => b.toggleAttribute('disabled', i <= 0));
      downs.forEach((b) => b.toggleAttribute('disabled', i >= PANEL_SCROLL_VH.length - 1));
    };
    updateDisabled();
    window.addEventListener('scroll', updateDisabled, { passive: true });
  }

  /* ---------------------------------------------------------
     Work row arrow mini-animation (diagonal exit + re-entry)
     --------------------------------------------------------- */
  function bindWorkArrowHover() {
    if (prefersReduced || typeof gsap === 'undefined') return;
    document.querySelectorAll('.work-row').forEach((row) => {
      const arrow = row.querySelector('.work-row__arrow');
      if (!arrow) return;
      row.addEventListener('mouseenter', () => {
        gsap.timeline({ overwrite: true })
          .to(arrow, { x: 36, y: -36, opacity: 0, duration: 0.15, ease: 'power2.in' })
          .set(arrow, { x: -36, y: 36 })
          .to(arrow, { x: 0, y: 0, opacity: 1, duration: 0.18, ease: 'power2.out' });
      });
      row.addEventListener('mouseleave', () => {
        gsap.to(arrow, { x: 0, y: 0, opacity: 1, duration: 0.3, ease: 'power2.out' });
      });
    });
  }

  /* ---------------------------------------------------------
     Motion (Lenis + GSAP + ScrollTrigger)
     --------------------------------------------------------- */
  function initMotion() {
    const hasGSAP  = typeof window.gsap !== 'undefined';
    const hasST    = typeof window.ScrollTrigger !== 'undefined';
    const hasLenis = typeof window.Lenis !== 'undefined';

    const revealAll = () => {
      document.querySelectorAll('.reveal').forEach((el) => {
        el.style.opacity = '1'; el.style.transform = 'none';
      });
      document.querySelectorAll('.word').forEach((el) => {
        el.style.opacity = '1'; el.style.transform = 'none';
      });
      document.querySelectorAll('.work-list li').forEach((li) => li.classList.add('is-inview'));
    };

    if (!hasGSAP) { revealAll(); return null; }
    if (hasST) gsap.registerPlugin(ScrollTrigger);
    if (prefersReduced) {
      revealAll();
      return null;
    }

    /* ---------- Lenis ---------- */
    let lenis = null;
    if (hasLenis) {
      lenis = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.2
      });
      if (hasST) {
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
      } else {
        const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
        requestAnimationFrame(raf);
      }
      document.querySelectorAll('a[href^="#"]').forEach((a) => {
        a.addEventListener('click', (e) => {
          const href = a.getAttribute('href');
          if (!href || href === '#') return;
          const target = document.querySelector(href);
          if (!target) return;
          e.preventDefault();
          lenis.scrollTo(target, { offset: 0, duration: 1.4 });
        });
      });
    }

    /* ---------- Hero entrance ---------- */
    // Initial state (CSS has word wrappers with overflow hidden; words start hidden)
    gsap.set('.hero__title .word', { y: 80, opacity: 0, skewX: -2 });

    const heroTL = gsap.timeline({ defaults: { ease: 'expo.out' } });
    heroTL
      .to('.hero__title .word', {
        y: 0, opacity: 1, skewX: 0,
        duration: 1.2, stagger: 0.08,
        delay: 0.6
      })
      .to('.hero__lead.reveal', {
        opacity: 1, y: 0,
        duration: 0.9
      }, 1.2); // absolute start at 1.2s from timeline origin

    if (!hasST) return lenis;

    /* ---------- Work enter (normal flow) ---------- */
    ScrollTrigger.create({
      trigger: '.work',
      start: 'top 80%',
      once: true,
      onEnter: () => {
        // Line separators scaleX 0 → 1
        document.querySelectorAll('.work-list li').forEach((li, idx) => {
          setTimeout(() => li.classList.add('is-inview'), idx * 120);
        });
        // Counter 00 → target
        document.querySelectorAll('.work-row [data-count-to]').forEach((numEl, idx) => {
          const target = parseInt(numEl.getAttribute('data-count-to'), 10) || 0;
          const obj = { v: 0 };
          gsap.to(obj, {
            v: target, duration: 1.2, ease: 'power2.out', delay: idx * 0.12,
            onUpdate: () => { numEl.textContent = String(Math.floor(obj.v)).padStart(2, '0'); },
            onComplete: () => { numEl.textContent = String(target).padStart(2, '0'); }
          });
        });
      }
    });
    gsap.from('.work .work-row__name', {
      y: 40, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'expo.out',
      scrollTrigger: { trigger: '.work', start: 'top 80%' }
    });
    gsap.from('.work .panel-label, .work .work-more', {
      y: 20, opacity: 0, duration: 0.8, stagger: 0.2, ease: 'expo.out',
      scrollTrigger: { trigger: '.work', start: 'top 80%' }
    });

    /* ---------- Services: per-panel stagger + infinite marquee ---------- */
    gsap.utils.toArray('.service-panel').forEach((panel) => {
      const num   = panel.querySelector('.service-num');
      const title = panel.querySelector('.service-title');
      const desc  = panel.querySelector('.service-desc');
      const cta   = panel.querySelector('.service-cta');
      gsap.from([num, title, desc, cta], {
        y: 60, opacity: 0, duration: 1, stagger: 0.1, ease: 'expo.out',
        scrollTrigger: { trigger: panel, start: 'top 75%' }
      });
    });

    gsap.utils.toArray('.service-marquee__track').forEach((track) => {
      const tween = gsap.to(track, {
        xPercent: -50, duration: 18, ease: 'linear', repeat: -1
      });
      ScrollTrigger.create({
        trigger: track.closest('.service-marquee'),
        start: 'top bottom',
        onEnter: () => tween.play(),
        onLeaveBack: () => tween.pause()
      });
      tween.pause();
    });

    /* ---------- About enter (normal flow, outside sticky-stack) ---------- */
    gsap.from('.about__figure', {
      x: 60, opacity: 0, duration: 1.2, ease: 'expo.out',
      scrollTrigger: { trigger: '.about', start: 'top 80%' }
    });
    gsap.from('.about__text > *', {
      y: 40, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.15,
      scrollTrigger: { trigger: '.about', start: 'top 80%' }
    });

    /* ---------- Contact enter (normal flow, outside sticky-stack) ---------- */
    gsap.from('.contact__inner > *', {
      opacity: 0,
      y: 40,
      duration: 0.9,
      stagger: 0.12,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: '.contact',
        start: 'top 80%'
      }
    });

    return lenis;
  }

  /* ---------------------------------------------------------
     Force hero video autoplay (mobile-safe)
     --------------------------------------------------------- */
  function forceVideoAutoplay() {
    const heroVideo = document.querySelector('.hero__video') || document.querySelector('video');
    if (!heroVideo) return;

    heroVideo.muted = true;
    heroVideo.playsInline = true;

    const tryPlay = () => {
      heroVideo.play().catch(() => {
        // If autoplay is still blocked, resume on first touch
        document.addEventListener('touchstart', () => {
          heroVideo.play();
        }, { once: true });
      });
    };

    if (document.readyState === 'complete') {
      tryPlay();
    } else {
      window.addEventListener('load', tryPlay);
    }

    // Resume when the tab becomes visible again
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && heroVideo.paused) {
        heroVideo.play().catch(() => {});
      }
    });
  }

  /* ---------------------------------------------------------
     Boot
     --------------------------------------------------------- */
  function boot() {
    document.documentElement.classList.remove('no-js');
    applyLang(currentLang);
    firstRender = false;
    bindLangToggle();
    setYear();
    scheduleFloatButton();
    bindWorkArrowHover();

    const lenis = initMotion();
    bindSectionNav(lenis);
    forceVideoAutoplay();

    document.documentElement.classList.add('is-ready');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
