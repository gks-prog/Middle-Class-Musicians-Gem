// /assets/js/components.js
class MCMNavbar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <nav class="nav" id="global-nav">
        <div class="nav-inner container">
          <a href="/" class="nav-logo">
            <img src="/assets/icons/favicon.png" alt="MCM Logo" class="logo-img" />
            <span class="logo-text">Middle Class Musicians</span>
          </a>
          <ul class="nav-links">
            <li><a href="/studio.html">Studio</a></li>
            <li><a href="/services/">Services</a></li>
            <li><a href="/portfolio.html">Portfolio</a></li>
            <li><a href="/courses.html">Courses</a></li>
            <li><a href="/auth/login.html" class="accent-text">Client Portal</a></li>
          </ul>
          <a href="https://wa.me/919315778147" class="nav-cta" data-sound="hover">Book Session</a>
        </div>
      </nav>
    `;
    this.setupScroll();
  }

  setupScroll() {
    const nav = this.querySelector('nav');
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }
}

class MCMFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="footer">
        <div class="container footer-inner">
          <div class="footer-brand">
            <strong>Middle Class Musicians</strong>
            <span>Built for sound. Designed for vision.<br>Delhi · India</span>
          </div>
          <div class="footer-copy">© ${new Date().getFullYear()} Middle Class Musicians.</div>
        </div>
      </footer>
    `;
  }
}

customElements.define('mcm-navbar', MCMNavbar);
customElements.define('mcm-footer', MCMFooter);
