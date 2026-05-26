class MCMNavbar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <nav class="nav-wrapper" id="global-nav">
        <div class="container nav-inner">
          <a href="/index.html" class="nav-logo" style="font-family: var(--font-head); font-size: 1.5rem; letter-spacing: 0.1em;">
            <span style="color: var(--gold);">MCM</span> STUDIO
          </a>
          <ul class="nav-links">
            <li><a href="/studio.html">Studio</a></li>
            <li><a href="/services.html">Services</a></li>
            <li><a href="/portfolio.html">Portfolio</a></li>
            <li><a href="/courses.html">Courses</a></li>
            <li><a href="/login.html" style="color: var(--gold);">Client Portal</a></li>
          </ul>
        </div>
      </nav>
    `;
    this.initScroll();
  }

  initScroll() {
    const nav = this.querySelector('#global-nav');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    }, { passive: true });
  }
}

class MCMFooter extends HTMLElement {
  connectedCallback() {
    const year = new Date().getFullYear();
    this.innerHTML = `
      <footer style="padding: 4rem 0; background: var(--bg-secondary); border-top: 1px solid var(--line); text-align: center;">
        <div class="container">
          <h3 style="font-size: 1.5rem; margin-bottom: 1rem;">Middle Class Musicians</h3>
          <p style="color: var(--muted); font-size: 0.9rem; margin-bottom: 2rem;">Built for sound. Designed for vision. Delhi, India.</p>
          <div style="font-size: 0.8rem; color: var(--muted); border-top: 1px solid var(--line); padding-top: 2rem;">
            &copy; ${year} Middle Class Musicians. All rights reserved.
          </div>
        </div>
      </footer>
    `;
  }
}

customElements.define('mcm-navbar', MCMNavbar);
customElements.define('mcm-footer', MCMFooter);
