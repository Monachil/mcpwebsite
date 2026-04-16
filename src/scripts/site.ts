let globalsBound = false;
let gatePdfUrl = '';

function showMessage(container: Element, type: 'success' | 'error', text: string, duration?: number) {
  const existing = container.querySelector('.form-message');
  if (existing) existing.remove();
  const msg = document.createElement('div');
  msg.className = 'form-message form-message--' + type;
  msg.setAttribute('role', type === 'error' ? 'alert' : 'status');
  const textEl = document.createElement('span');
  textEl.className = 'form-message-text';
  textEl.textContent = text;
  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'form-message-close';
  closeBtn.setAttribute('aria-label', 'Dismiss message');
  closeBtn.textContent = '\u00d7';
  closeBtn.addEventListener('click', () => msg.remove());
  msg.appendChild(textEl);
  msg.appendChild(closeBtn);
  container.appendChild(msg);
  const timer = window.setTimeout(() => msg.remove(), duration || 10000);
  msg.addEventListener('mouseenter', () => window.clearTimeout(timer));
}

function openVideo(src: string) {
  const modal = document.getElementById('videoModal');
  const player = document.getElementById('videoModalPlayer');
  if (!modal || !player) return;
  player.innerHTML =
    '<iframe src="' + src + '" title="Video" frameborder="0" ' +
    'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" ' +
    'referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';
  modal.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function closeVideo() {
  const modal = document.getElementById('videoModal');
  const player = document.getElementById('videoModalPlayer');
  if (!modal) return;
  modal.classList.remove('is-open');
  document.body.style.overflow = '';
  if (player) player.innerHTML = '';
}

function openGate(pdfUrl: string, resource?: string) {
  gatePdfUrl = pdfUrl;
  const modal = document.getElementById('gateModal');
  const resourceInput = document.getElementById('gateResource') as HTMLInputElement | null;
  if (resourceInput) resourceInput.value = resource || pdfUrl.split('/').pop()!.replace('.pdf', '');
  if (modal) {
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
}

function closeGate() {
  const modal = document.getElementById('gateModal');
  if (modal) {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  }
  gatePdfUrl = '';
}

function closeMenu() {
  const overlay = document.getElementById('menuOverlay');
  if (overlay) {
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }
}

function selectPosition(item: HTMLElement) {
  const siblings = Array.from(
    document.querySelectorAll<HTMLElement>('.position-item')
  );
  siblings.forEach((el) => {
    el.classList.remove('position-item--active');
    el.setAttribute('aria-selected', 'false');
    el.tabIndex = -1;
  });
  item.classList.add('position-item--active');
  item.setAttribute('aria-selected', 'true');
  item.tabIndex = 0;

  const panelId = item.dataset.panel;
  document.querySelectorAll<HTMLElement>('.position-panel').forEach((p) => {
    p.classList.remove('position-panel--active');
    p.hidden = true;
  });
  if (panelId) {
    const panel = document.getElementById(panelId);
    if (panel) {
      panel.hidden = false;
      panel.classList.add('position-panel--active');
    }
  }

  const title = item.dataset.position || '';
  const hiddenPosition = document.getElementById('app-position') as HTMLInputElement | null;
  if (hiddenPosition) hiddenPosition.value = title;
  const displayPosition = document.getElementById('app-applying-for-display');
  if (displayPosition) displayPosition.textContent = title;
}

function toggleTheme() {
  const current = document.documentElement.dataset.theme;
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  localStorage.setItem('theme', next);
  updateToggleButton(next);
}

function updateToggleButton(theme: string | undefined) {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  btn.setAttribute('aria-checked', theme === 'light' ? 'true' : 'false');
}

function bindGlobalListeners() {
  if (globalsBound) return;
  globalsBound = true;

  window.addEventListener('scroll', () => {
    const nav = document.getElementById('nav');
    const scrollBar = document.getElementById('scrollProgress');
    if (nav) nav.classList.toggle('nav--scrolled', window.scrollY > 10);
    if (scrollBar) {
      const dh = document.documentElement.scrollHeight - window.innerHeight;
      scrollBar.style.width = dh > 0 ? (window.scrollY / dh * 100) + '%' : '0%';
    }
  }, { passive: true });

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let pTicking = false;
    window.addEventListener('scroll', () => {
      if (pTicking) return;
      pTicking = true;
      requestAnimationFrame(() => {
        document.querySelectorAll<HTMLElement>('.section-title').forEach(h => {
          const r = h.getBoundingClientRect();
          if (r.top < window.innerHeight && r.bottom > 0) {
            h.style.transform = 'translateY(' + (r.top - window.innerHeight * 0.5) * 0.04 + 'px)';
          }
        });
        pTicking = false;
      });
    }, { passive: true });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMenu();
      closeVideo();
      closeGate();
      return;
    }

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Home' || e.key === 'End') {
      const active = document.activeElement as HTMLElement | null;
      if (active && active.classList.contains('position-item')) {
        const items = Array.from(document.querySelectorAll<HTMLElement>('.position-item'));
        if (items.length === 0) return;
        const idx = items.indexOf(active);
        let next = idx;
        if (e.key === 'ArrowDown') next = (idx + 1) % items.length;
        else if (e.key === 'ArrowUp') next = (idx - 1 + items.length) % items.length;
        else if (e.key === 'Home') next = 0;
        else if (e.key === 'End') next = items.length - 1;
        if (next !== idx) {
          e.preventDefault();
          selectPosition(items[next]);
          items[next].focus();
        }
      }
    }
  });

  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;

    if (target.closest('#themeToggle')) { toggleTheme(); return; }

    if (target.closest('#navToggle')) {
      const overlay = document.getElementById('menuOverlay');
      if (overlay) {
        overlay.classList.add('is-open');
        document.body.style.overflow = 'hidden';
      }
      return;
    }
    if (target.closest('#menuClose')) { closeMenu(); return; }
    if (target.id === 'menuOverlay') { closeMenu(); return; }

    if (target.closest('#videoModalClose')) { closeVideo(); return; }
    if (target.id === 'videoModal') { closeVideo(); return; }

    if (target.closest('#gateModalClose')) { closeGate(); return; }
    if (target.id === 'gateModal') { closeGate(); return; }

    const gateBtn = target.closest<HTMLElement>('.btn-gated');
    if (gateBtn) {
      const pdfUrl = gateBtn.dataset.gatePdf;
      const resource = gateBtn.dataset.gateResource;
      if (pdfUrl) {
        if (localStorage.getItem('gate_email')) {
          window.open(pdfUrl, '_blank');
        } else {
          openGate(pdfUrl, resource);
        }
      }
      return;
    }

    const embedCard = target.closest<HTMLElement>('.media-card--embed');
    if (embedCard) {
      const ytId = embedCard.dataset.youtube;
      const embedUrl = embedCard.dataset.embed;
      if (ytId) openVideo('https://www.youtube.com/embed/' + ytId + '?autoplay=1&rel=0&modestbranding=1');
      else if (embedUrl) openVideo(embedUrl);
      return;
    }

    const contactTab = target.closest<HTMLElement>('.contact-tab');
    if (contactTab) {
      document.querySelectorAll('.contact-tab').forEach(t => t.classList.remove('contact-tab--active'));
      document.querySelectorAll('.contact-pane').forEach(p => p.classList.remove('contact-pane--active'));
      contactTab.classList.add('contact-tab--active');
      const pane = document.getElementById('pane-' + contactTab.dataset.tab);
      if (pane) pane.classList.add('contact-pane--active');
      return;
    }

    const pageTab = target.closest<HTMLElement>('.page-tab');
    if (pageTab) {
      document.querySelectorAll('.page-tab').forEach(t => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('is-active'));
      pageTab.classList.add('is-active');
      pageTab.setAttribute('aria-selected', 'true');
      const panelId = pageTab.getAttribute('aria-controls');
      if (panelId) {
        const panel = document.getElementById(panelId);
        if (panel) panel.classList.add('is-active');
      }
      return;
    }

    const posItem = target.closest<HTMLElement>('.position-item[data-position]');
    if (posItem) {
      selectPosition(posItem);
      return;
    }

    const filterBtn = target.closest<HTMLElement>('.year-filter-btn');
    if (filterBtn) {
      const year = filterBtn.dataset.year;
      document.querySelectorAll('.year-filter-btn').forEach(b => b.classList.remove('is-active'));
      filterBtn.classList.add('is-active');
      let count = 0;
      document.querySelectorAll<HTMLElement>('[data-year]:not(.year-filter-btn)').forEach(item => {
        const show = year === 'all' || item.dataset.year === year;
        item.style.display = show ? '' : 'none';
        if (show) count++;
      });
      const counter = document.getElementById('research-visible-count');
      if (counter) counter.textContent = String(count);
      return;
    }
  });

  document.addEventListener('submit', (e) => {
    const form = e.target as HTMLFormElement;
    const btn = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    if (!btn) return;
    const originalText = btn.textContent || '';

    if (form.hasAttribute('data-mailchimp')) {
      e.preventDefault();
      const isGateForm = form.id === 'gateForm';
      const emailInput = form.querySelector<HTMLInputElement>('input[name="EMAIL"]');
      const emailValue = emailInput?.value;
      btn.textContent = isGateForm ? 'Processing...' : 'Subscribing...';
      btn.disabled = true;

      const iframeName = 'mc-iframe-' + Date.now();
      const iframe = document.createElement('iframe');
      iframe.name = iframeName;
      iframe.style.display = 'none';
      document.body.appendChild(iframe);

      form.target = iframeName;
      form.submit();

      window.setTimeout(() => {
        form.reset();
        form.target = '';
        btn.textContent = originalText;
        btn.disabled = false;
        iframe.remove();

        if (isGateForm && gatePdfUrl) {
          if (emailValue) localStorage.setItem('gate_email', emailValue);
          window.open(gatePdfUrl, '_blank');
          closeGate();
        } else if (form.parentElement) {
          showMessage(form.parentElement, 'success', 'Thank you! Please check your email to confirm your subscription.');
        }
      }, 2000);
      return;
    }

    const fileInput = form.querySelector<HTMLInputElement>('input[type="file"][data-max-size]');
    if (fileInput && fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      const maxBytes = parseInt(fileInput.getAttribute('data-max-size') || '0', 10);
      const accepted = (fileInput.getAttribute('accept') || '').split(',').map(t => t.trim().toLowerCase());
      const fileName = file.name.toLowerCase();
      const extOk = accepted.length === 0 || accepted.some(t => fileName.endsWith(t));
      if (!extOk) {
        e.preventDefault();
        if (form.parentElement) showMessage(form.parentElement, 'error', 'Please upload a PDF, DOC, or DOCX file.');
        return;
      }
      if (maxBytes && file.size > maxBytes) {
        e.preventDefault();
        if (form.parentElement) showMessage(form.parentElement, 'error', 'File is too large. Maximum size is ' + Math.round(maxBytes / 1048576) + 'MB.');
        return;
      }
    }

    if (!form.hasAttribute('data-formsubmit-ajax')) return;
    e.preventDefault();

    const emailField = form.querySelector<HTMLInputElement>('input[type="email"]');
    if (emailField && emailField.value) {
      let replyTo = form.querySelector<HTMLInputElement>('input[name="_replyto"]');
      if (!replyTo) {
        replyTo = document.createElement('input');
        replyTo.type = 'hidden';
        replyTo.name = '_replyto';
        form.appendChild(replyTo);
      }
      replyTo.value = emailField.value;
    }

    const subjectSelect = form.querySelector<HTMLSelectElement>('select[name="subject"]');
    const existingCc = form.querySelector<HTMLInputElement>('input[name="_cc"]');
    if (existingCc) existingCc.remove();
    if (subjectSelect && subjectSelect.value === 'investment') {
      const cc = document.createElement('input');
      cc.type = 'hidden';
      cc.name = '_cc';
      cc.value = 'ir@monachilpartners.com';
      form.appendChild(cc);
    }

    btn.textContent = 'Sending...';
    btn.disabled = true;

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' },
    })
      .then((res) => res.json().catch(() => ({})).then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        const success = ok && (data as { success?: string | boolean }).success !== false && String((data as { success?: string | boolean }).success) !== 'false';
        if (success) {
          form.reset();
          if (form.parentElement) showMessage(form.parentElement, 'success', 'Thank you — your message has been sent. We will be in touch shortly.');
        } else if (form.parentElement) {
          showMessage(form.parentElement, 'error', 'Something went wrong. Please try again or email info@monachilpartners.com directly.');
        }
      })
      .catch(() => {
        if (form.parentElement) showMessage(form.parentElement, 'error', 'Network error. Please check your connection and try again.');
      })
      .finally(() => {
        btn.textContent = originalText;
        btn.disabled = false;
      });
  });

  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      document.documentElement.dataset.theme = e.matches ? 'light' : 'dark';
      updateToggleButton(e.matches ? 'light' : 'dark');
    }
  });
}

function initPage() {
  document.documentElement.classList.add('js-fade-ready');
  const faders = document.querySelectorAll('.fade-in:not(.is-visible)');
  if (faders.length && 'IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    faders.forEach((el) => obs.observe(el));
  } else {
    faders.forEach((el) => el.classList.add('is-visible'));
  }

  const stats = document.querySelectorAll('.stat-number:not(.stat-counted)');
  if (stats.length && 'IntersectionObserver' in window) {
    const sObs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('stat-counted');
          sObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    stats.forEach((el) => sObs.observe(el));
  }

  const params = new URLSearchParams(window.location.search);
  if (params.get('submitted') === 'careers') {
    const ct = document.querySelector<HTMLElement>('.contact-tab[data-tab="careers"]');
    if (ct) ct.click();
    const wrapper = document.querySelector<HTMLElement>('.careers-form-wrapper');
    if (wrapper) showMessage(wrapper, 'success', 'Thank you — your application has been received. We will be in touch shortly.');
    const url = new URL(window.location.href);
    url.searchParams.delete('submitted');
    window.history.replaceState({}, '', url.pathname + (url.hash || ''));
  }

  const hash = window.location.hash.slice(1);
  if (hash === 'careers') {
    const ct = document.querySelector<HTMLElement>('.contact-tab[data-tab="careers"]');
    if (ct) ct.click();
  }
  if (hash === 'team') {
    const t = document.getElementById('tab-team');
    if (t) t.click();
  }
  if (hash === 'press') {
    const p = document.getElementById('tab-press');
    if (p) p.click();
  }

  if (localStorage.getItem('gate_email')) {
    document.querySelectorAll<HTMLElement>('.btn-gated').forEach((btn) => { btn.hidden = true; });
    document.querySelectorAll<HTMLElement>('.btn-gated-direct').forEach((btn) => { btn.hidden = false; });
  }

  updateToggleButton(document.documentElement.dataset.theme);
}

document.addEventListener('astro:after-swap', () => {
  const s = localStorage.getItem('theme');
  const os = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  document.documentElement.dataset.theme = s || os;
});

document.addEventListener('astro:page-load', () => {
  bindGlobalListeners();
  initPage();
});
