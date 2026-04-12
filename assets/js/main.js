(function() {
  'use strict';

  // Nav scroll effect
  var nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', function() {
      nav.classList.toggle('nav--scrolled', window.scrollY > 10);
    });
  }

  // Menu overlay
  var toggle = document.getElementById('navToggle');
  var overlay = document.getElementById('menuOverlay');
  var close = document.getElementById('menuClose');

  function openMenu() {
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  if (toggle) toggle.addEventListener('click', openMenu);
  if (close) close.addEventListener('click', closeMenu);

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeMenu();
  });

  if (overlay) {
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) closeMenu();
    });
  }

  // Fade-in on scroll
  document.documentElement.classList.add('js-fade-ready');

  var faders = document.querySelectorAll('.fade-in');
  if (faders.length && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    faders.forEach(function(el) { observer.observe(el); });
  } else {
    faders.forEach(function(el) { el.classList.add('is-visible'); });
  }

  // Video modal (media page)
  var videoModal = document.getElementById('videoModal');
  var videoPlayer = document.getElementById('videoPlayer');
  var videoModalClose = document.getElementById('videoModalClose');

  if (videoModal && videoPlayer) {
    document.querySelectorAll('.media-card[data-video]').forEach(function(card) {
      card.addEventListener('click', function(e) {
        e.preventDefault();
        var src = this.dataset.video;
        videoPlayer.querySelector('source').src = src;
        videoPlayer.load();
        videoModal.classList.add('is-open');
        document.body.style.overflow = 'hidden';
        videoPlayer.play();
      });
    });

    function closeVideoModal() {
      videoModal.classList.remove('is-open');
      document.body.style.overflow = '';
      videoPlayer.pause();
      videoPlayer.currentTime = 0;
    }

    if (videoModalClose) videoModalClose.addEventListener('click', closeVideoModal);

    videoModal.addEventListener('click', function(e) {
      if (e.target === videoModal) closeVideoModal();
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && videoModal.classList.contains('is-open')) {
        closeVideoModal();
      }
    });
  }

  // Hero particle animation (Option B)
  var heroSection = document.querySelector('.hero[data-hero-effect="particles"]');
  var canvas = document.getElementById('heroParticles');
  if (heroSection && canvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var ctx = canvas.getContext('2d');
    var dpr = window.devicePixelRatio || 1;
    var particles = [];
    var pw, ph;
    var PARTICLE_COUNT = window.innerWidth < 768 ? 30 : 55;
    var MAX_DIST = 140;

    function resizeCanvas() {
      pw = canvas.parentElement.offsetWidth;
      ph = canvas.parentElement.offsetHeight;
      canvas.width = pw * dpr;
      canvas.height = ph * dpr;
      canvas.style.width = pw + 'px';
      canvas.style.height = ph + 'px';
      ctx.scale(dpr, dpr);
    }

    function makeParticle() {
      return {
        x: Math.random() * pw,
        y: Math.random() * ph,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.35 + 0.1
      };
    }

    function initParticles() {
      resizeCanvas();
      particles = [];
      for (var i = 0; i < PARTICLE_COUNT; i++) particles.push(makeParticle());
    }

    function animateParticles() {
      ctx.clearRect(0, 0, pw, ph);
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = pw; if (p.x > pw) p.x = 0;
        if (p.y < 0) p.y = ph; if (p.y > ph) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,' + p.alpha + ')';
        ctx.fill();
        for (var j = i + 1; j < particles.length; j++) {
          var p2 = particles[j];
          var dx = p.x - p2.x, dy = p.y - p2.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = 'rgba(255,255,255,' + ((1 - dist / MAX_DIST) * 0.12) + ')';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();
    var resizeTimer;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(initParticles, 200);
    });
  }

  // Contact page tabs
  var contactTabs = document.querySelectorAll('.contact-tab');
  function switchTab(target) {
    contactTabs.forEach(function(t) { t.classList.remove('contact-tab--active'); });
    document.querySelectorAll('.contact-pane').forEach(function(pane) {
      pane.classList.remove('contact-pane--active');
    });
    var btn = document.querySelector('.contact-tab[data-tab="' + target + '"]');
    var pane = document.getElementById('pane-' + target);
    if (btn) btn.classList.add('contact-tab--active');
    if (pane) pane.classList.add('contact-pane--active');
  }
  contactTabs.forEach(function(tab) {
    tab.addEventListener('click', function() { switchTab(this.dataset.tab); });
  });
  if (contactTabs.length && window.location.hash === '#careers') switchTab('careers');

  // Careers position card selection
  var positionCards = document.querySelectorAll('.position-card[data-position]');
  positionCards.forEach(function(card) {
    card.addEventListener('click', function() {
      var position = this.dataset.position;
      positionCards.forEach(function(c) { c.classList.remove('position-card--active'); });
      this.classList.add('position-card--active');
      var radios = document.querySelectorAll('input[name="position"]');
      radios.forEach(function(radio) {
        if (radio.value === position) radio.checked = true;
      });
    });
  });

  // Year filter (research & media pages)
  var filterBtns = document.querySelectorAll('.year-filter-btn');
  filterBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var year = this.dataset.year;

      filterBtns.forEach(function(b) { b.classList.remove('is-active'); });
      this.classList.add('is-active');

      var items = document.querySelectorAll('[data-year]');
      items.forEach(function(item) {
        if (item.classList.contains('year-filter-btn')) return;
        if (year === 'all' || item.dataset.year === year) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
})();
