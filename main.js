/* Blastcraft Limited — Timaru
   Site script: intro, hero rotation, nav, reveal, gmail compose links */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Opening animation ---------- */
  var intro = document.getElementById('intro');
  function closeIntro() {
    if (!intro || intro.classList.contains('is-done')) return;
    intro.classList.add('is-done');
    document.body.classList.add('is-ready');
    revealNow();
  }
  if (intro) {
    window.setTimeout(closeIntro, reduced ? 120 : 1450);
    window.addEventListener('load', function () { window.setTimeout(closeIntro, reduced ? 0 : 1150); });
  }

  /* ---------- Gmail compose links (address built in JS, never in HTML) ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('a[data-gmail]'), function (a) {
    var to = a.getAttribute('data-user') + '@' + a.getAttribute('data-domain');
    a.href = 'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(to) +
             '&su=' + (a.getAttribute('data-su') || '') +
             '&body=' + (a.getAttribute('data-body') || '');
    a.target = '_blank';
    a.rel = 'noopener';
  });

  /* ---------- Nav: sticky state + mobile menu ---------- */
  var nav = document.getElementById('nav');
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');

  function onScroll() {
    if (!nav) return;
    if (window.scrollY > 24) nav.classList.add('is-stuck');
    else if (!nav.classList.contains('is-open')) nav.classList.remove('is-stuck');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      if (open) nav.classList.add('is-stuck');
      else onScroll();
    });
  }
  if (navLinks) {
    Array.prototype.forEach.call(navLinks.querySelectorAll('a'), function (a) {
      a.addEventListener('click', function () {
        if (!nav) return;
        nav.classList.remove('is-open');
        if (navToggle) {
          navToggle.setAttribute('aria-expanded', 'false');
          navToggle.setAttribute('aria-label', 'Open menu');
        }
        onScroll();
      });
    });
  }

  /* ---------- Hero rotation ---------- */
  var slides = document.querySelectorAll('.hero__img');
  var dots = document.querySelectorAll('.hero__dot');
  var current = 0;
  var timer = null;

  function show(i) {
    if (!slides.length) return;
    current = (i + slides.length) % slides.length;
    Array.prototype.forEach.call(slides, function (s, n) {
      s.classList.toggle('is-on', n === current);
    });
    Array.prototype.forEach.call(dots, function (d, n) {
      d.classList.toggle('is-on', n === current);
    });
  }
  function start() {
    if (reduced || slides.length < 2) return;
    stop();
    timer = window.setInterval(function () { show(current + 1); }, 5500);
  }
  function stop() { if (timer) { window.clearInterval(timer); timer = null; } }

  Array.prototype.forEach.call(dots, function (d, n) {
    d.addEventListener('click', function () { show(n); start(); });
  });
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop(); else start();
  });
  start();

  /* ---------- Scroll reveal ---------- */
  var items = document.querySelectorAll('.reveal');

  function revealNow() {
    Array.prototype.forEach.call(document.querySelectorAll('.hero .reveal'), function (el, n) {
      window.setTimeout(function () { el.classList.add('is-in'); }, reduced ? 0 : n * 110);
    });
  }

  if (reduced || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(items, function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var siblings = el.parentNode ? Array.prototype.indexOf.call(el.parentNode.children, el) : 0;
        window.setTimeout(function () { el.classList.add('is-in'); }, Math.min(siblings, 5) * 80);
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    Array.prototype.forEach.call(items, function (el) {
      if (el.closest('.hero')) return;
      io.observe(el);
    });
  }

  /* ---------- Footer year ---------- */
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = String(new Date().getFullYear());
})();
