// script.js - mobile menu and small helpers

document.addEventListener('DOMContentLoaded', function () {
    // set copyright year
    const y = new Date().getFullYear();
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = y;
  
    // mobile menu toggle
    const burger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
  
    if (burger && mobileNav) {
      burger.addEventListener('click', function () {
        const expanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', String(!expanded));
        mobileNav.setAttribute('aria-hidden', expanded ? 'true' : 'false');
        mobileNav.style.display = expanded ? 'none' : 'flex';
  
        // animate hamburger
        this.classList.toggle('open');
        if (this.classList.contains('open')) {
          // transform lines to X
          this.querySelector('.hamburger-inner').style.transform = 'rotate(45deg)';
          this.querySelector('.hamburger-inner::before');
        } else {
          this.querySelector('.hamburger-inner').style.transform = 'translateY(-50%)';
        }
      });
    }
  
    // smooth scroll polyfill for older browsers (native behavior is used via CSS anchor)
    // close mobile nav when link clicked
    document.querySelectorAll('.mobile-nav a, nav.desktop a').forEach(a => {
      a.addEventListener('click', function () {
        const nav = document.querySelector('.mobile-nav');
        if (nav && window.innerWidth < 1000) {
          nav.style.display = 'none';
          const burgerBtn = document.querySelector('.hamburger');
          if (burgerBtn) burgerBtn.setAttribute('aria-expanded', 'false');
        }
      });
    });
  
    // close mobile nav on resize to desktop
    window.addEventListener('resize', () => {
      const nav = document.querySelector('.mobile-nav');
      if (nav && window.innerWidth >= 1000) {
        nav.style.display = 'none';
        const burgerBtn = document.querySelector('.hamburger');
        if (burgerBtn) burgerBtn.setAttribute('aria-expanded', 'false');
      }
    });
  });

  
  // ensure this runs after DOMContentLoaded (or include at bottom of page)
document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('demoVideo');
    const toggle = document.getElementById('videoToggle');
  
    // Attempt to play the video (browser may block autoplay unless muted)
    if (video) {
      const tryPlay = async () => {
        try {
          await video.play();
        } catch (err) {
          // Browsers often block autoplay until user interacts. Keep muted true.
          console.log('Autoplay prevented:', err);
        }
      };
      tryPlay();
  
      // Show fallback image if video fails to load or is unsupported
      video.addEventListener('error', () => {
        const fallback = document.querySelector('.video-fallback');
        if (fallback) fallback.style.display = 'block';
        video.style.display = 'none';
      });
  
      // toggle play/pause on the overlay button
      if (toggle) {
        toggle.addEventListener('click', (e) => {
          e.preventDefault();
          if (video.paused) {
            video.play();
            toggle.setAttribute('aria-pressed', 'false');
            // reset button style to "playing"
            toggle.innerHTML = `<span class="vis">Pause</span>
              <svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 5h4v14H6zM14 5h4v14h-4z" fill="currentColor"></path>
              </svg>`;
          } else {
            video.pause();
            toggle.setAttribute('aria-pressed', 'true');
            // show play icon
            toggle.innerHTML = `<span class="vis">Play</span>
              <svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 3v18l15-9L5 3z" fill="currentColor"/></svg>`;
          }
        });
      }
  
      // pause video when user switches tab to save bandwidth
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          if (!video.paused) video.pause();
        } else {
          // try to resume muted autoplay when tab becomes active
          if (video && video.paused) video.play().catch(()=>{});
        }
      });
    }
  });

  
  // script.js - small helpers for accessibility & UX

document.addEventListener('DOMContentLoaded', function () {
    // set copyright year
    const y = new Date().getFullYear();
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = y;
  
    // mobile nav: close when a link is clicked (uncheck checkbox)
    const navToggle = document.getElementById('nav-toggle');
    const mobileLinks = document.querySelectorAll('.nav-mobile a, .nav-desktop a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navToggle && window.getComputedStyle(document.querySelector('.hamburger')).display !== 'none') {
          navToggle.checked = false;
        }
      });
    });
  
    // Video autoplay & toggle
    const video = document.getElementById('demoVideo');
    const toggle = document.getElementById('videoToggle');
  
    if (video) {
      // try to play (muted autoplay is usually allowed)
      video.play().catch(() => { /* ignore autoplay block */ });
  
      // fallback on error: show poster image
      video.addEventListener('error', () => {
        const fallback = document.querySelector('.video-fallback');
        if (fallback) fallback.style.display = 'block';
        video.style.display = 'none';
      });
  
      // toggle play/pause button
      if (toggle) {
        // initialize button icon to pause (since autoplay muted attempts to play)
        toggle.setAttribute('aria-pressed', String(video.paused));
        updateToggleIcon(toggle, !video.paused);
  
        toggle.addEventListener('click', (e) => {
          e.preventDefault();
          if (video.paused) {
            video.play().catch(() => {});
            toggle.setAttribute('aria-pressed', 'false');
            updateToggleIcon(toggle, true);
          } else {
            video.pause();
            toggle.setAttribute('aria-pressed', 'true');
            updateToggleIcon(toggle, false);
          }
        });
  
        // update icon if playback state changes elsewhere
        video.addEventListener('play', () => updateToggleIcon(toggle, true));
        video.addEventListener('pause', () => updateToggleIcon(toggle, false));
      }
  
      // pause video when tab is hidden to save CPU/bandwidth
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          if (!video.paused) video.pause();
        } else {
          // attempt to resume muted autoplay when returning
          if (video && video.paused) video.play().catch(()=>{});
        }
      });
    }
  
    function updateToggleIcon(btn, isPlaying) {
      // isPlaying = true -> show pause icon; false -> show play icon
      if (!btn) return;
      if (isPlaying) {
        btn.innerHTML = `<span class="vis">Pause</span>
          <svg class="icon" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 5h4v14H6zM14 5h4v14h-4z" fill="currentColor"></path>
          </svg>`;
      } else {
        btn.innerHTML = `<span class="vis">Play</span>
          <svg class="icon" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 3v18l15-9L5 3z" fill="currentColor"/></svg>`;
      }
    }
  
  });
 
  
  /* Scroll reveal: tiny IntersectionObserver + stagger logic
     - No HTML changes required
     - Respects prefers-reduced-motion
  */
  (function () {
    if (typeof window === 'undefined') return;
  
    // Respect reduced motion: add in-view immediately and stop
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      // find all potential targets and immediately mark as visible
      const all = document.querySelectorAll(
        '.section, .about-card, .feature, .step, .member, .earn-card, .hero-text, .cta .metrics, .contact-form.card, .feature-grid .feature, .steps .step, .team-grid .member'
      );
      all.forEach(el => {
        el.classList.add('reveal', 'in-view');
      });
      // also handle reveal groups
      const groups = document.querySelectorAll('.steps, .feature-grid, .team-grid');
      groups.forEach(g => g.classList.add('reveal-group','in-view'));
      return;
    }
  
    // selectors for single elements to reveal
    const singleSelectors = [
      '.section',
      '.hero-text',
      '.about-card',
      '.earn-card',
      '.contact-form.card',
      '.cta .metrics'
    ];
  
    // selectors for groups where children animate staggered
    const groupSelectors = [
      '.steps',        // children: .step
      '.feature-grid', // children: .feature
      '.team-grid'     // children: .member
    ];
  
    // build node lists
    const singles = Array.from(document.querySelectorAll(singleSelectors.join(',')));
    const groups  = Array.from(document.querySelectorAll(groupSelectors.join(',')));
  
    // mark elements with base classes
    singles.forEach(el => {
      // avoid adding duplicate classes
      if (!el.classList.contains('reveal')) el.classList.add('reveal');
      // make large hero text a bit different
      if (el.classList.contains('hero-text')) el.classList.add('large');
    });
  
    groups.forEach(g => {
      if (!g.classList.contains('reveal-group')) g.classList.add('reveal-group');
    });
  
    // also reveal smaller repeated items individually (in case they are not inside a group)
    const extras = Array.from(document.querySelectorAll('.feature-grid .feature, .steps .step, .team-grid .member'));
    extras.forEach(el => {
      if (!el.closest('.reveal-group')) {
        // if item isn't already inside a group (rare), make it a reveal item
        if (!el.classList.contains('reveal')) el.classList.add('reveal','small');
      }
    });
  
    // IntersectionObserver options
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -10% 0px', // start a bit before the element fully enters
      threshold: 0.12
    };
  
    // Observer callback for single elements
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          // stop observing once revealed
          obs.unobserve(entry.target);
        }
      });
    }, observerOptions);
  
    singles.forEach(el => observer.observe(el));
  
    // For groups, we want to stagger the children when the group enters
    const groupObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const group = entry.target;
        const children = Array.from(group.children).filter(Boolean);
        // base delay and increment
        const base = 60; // ms
        children.forEach((child, i) => {
          // reset any inline style first
          child.style.transitionDelay = `${i * base}ms`;
          // set reveal transitions on the child if needed
          // ensure children have transitions (in case CSS fallback used)
          child.style.willChange = 'opacity, transform';
        });
        // add in-view to parent which uses CSS to reveal children
        group.classList.add('in-view');
        // unobserve after reveal
        obs.unobserve(group);
      });
    }, observerOptions);
  
    groups.forEach(g => groupObserver.observe(g));
  
    // Also observe standalone extras (in case page uses them)
    extras.forEach(el => {
      if (!el.closest('.reveal-group')) observer.observe(el);
    });
  
    // optional: once DOM is loaded, reveal the topmost hero quickly (avoid perceived blank)
    window.addEventListener('load', () => {
      const heroText = document.querySelector('.hero-text');
      if (heroText) {
        heroText.classList.add('in-view');
      }
    });
  
  })();
  
   
  