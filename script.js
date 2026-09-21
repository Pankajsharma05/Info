(function () {
    'use strict';

    // ---- Theme toggle ----
    var root = document.documentElement;
    var themeToggle = document.getElementById('themeToggle');

    function currentTheme() {
        var saved = null;
        try { saved = localStorage.getItem('theme'); } catch (e) {}
        if (saved) return saved;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            var next = currentTheme() === 'dark' ? 'light' : 'dark';
            root.setAttribute('data-theme', next);
            try { localStorage.setItem('theme', next); } catch (e) {}
        });
    }

    // ---- Mobile nav toggle ----
    var navToggle = document.getElementById('navToggle');
    var navLinks = document.getElementById('navLinks');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function () {
            var open = navLinks.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        });

        navLinks.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navLinks.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // ---- Sticky nav shadow on scroll ----
    var siteNav = document.getElementById('siteNav');
    var backToTop = document.getElementById('backToTop');

    function onScroll() {
        var scrolled = window.scrollY > 8;
        if (siteNav) siteNav.classList.toggle('scrolled', scrolled);
        if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 500);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (backToTop) {
        backToTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ---- Scroll-spy active nav link ----
    var sections = document.querySelectorAll('main section[id]');
    var navAnchors = document.querySelectorAll('.nav-links a');

    if ('IntersectionObserver' in window && sections.length) {
        var spy = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var id = entry.target.getAttribute('id');
                navAnchors.forEach(function (a) {
                    a.classList.toggle('active', a.getAttribute('href') === '#' + id);
                });
            });
        }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

        sections.forEach(function (s) { spy.observe(s); });

        // ---- Reveal-on-scroll ----
        var reveal = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        sections.forEach(function (s) { reveal.observe(s); });

        // Safety net: guarantee every section becomes visible even if the
        // observer never fires for it (e.g. slow load, automated capture).
        setTimeout(function () {
            sections.forEach(function (s) { s.classList.add('in-view'); });
        }, 1800);
    } else {
        sections.forEach(function (s) { s.classList.add('in-view'); });
    }
})();
