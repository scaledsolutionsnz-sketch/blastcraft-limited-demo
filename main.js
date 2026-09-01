/* Blastcraft Limited - Timaru
   Site script: intro, hero rotation, nav, reveal, gmail compose links */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Hero reveal on load ---------- */
  window.addEventListener('DOMContentLoaded', function () { revealNow(); });

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

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
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

  /* ---------- Hero review widget: same example set as the review cards ---------- */
  var REVIEWS = [
    { quote: 'Dropped a stock crate and hay feeders off Monday, back on the truck Thursday. Finish is miles better than the coating they came with.', by: 'Dave R., Washdyke' },
    { quote: 'Rang about a rusted-out balustrade on a coastal build. They quoted it in writing and the price did not move at the end.', by: 'Kelly M., Temuka' },
    { quote: 'Our frames sit in salt air year round. Two seasons on there is still no rust bleeding through the paint.', by: 'Sione T., Timaru' },
    { quote: 'Old cast iron bath, blasted back and sprayed the colour I picked. They talked me through what would hold up first.', by: 'Anna B., Geraldine' }
  ];
  var revBody = document.getElementById('heroReviewBody');
  if (revBody && REVIEWS.length > 1 && !reduced) {
    var rIdx = 0;
    window.setInterval(function () {
      revBody.classList.add('is-fading');
      window.setTimeout(function () {
        rIdx = (rIdx + 1) % REVIEWS.length;
        revBody.querySelector('q').textContent = REVIEWS[rIdx].quote;
        revBody.querySelector('.herorev__by').textContent = REVIEWS[rIdx].by;
        revBody.classList.remove('is-fading');
      }, 450);
    }, 6000);
  }

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
