class MCMNavbar extends HTMLElement {
  connectedCallback() {
    const currentPath = window.location.pathname;
    
    this.innerHTML = `
      <header class="nav-wrapper" id="main-nav">
        <div class="nav-inner container">
          <a href="/" class="nav-logo">
            <span>MCM</span>
          </a>
          <ul class="nav-links">
            <li><a href="/studio.html" ${currentPath.includes('studio') ? 'class="active"' : ''}>Studio</a></li>
            <li><a href="/services/" ${currentPath.includes('services') ? 'class="active"' : ''}>Services</a></li>
            <li><a href="/portfolio.html" ${currentPath.includes('portfolio') ? 'class="active"' : ''}>Portfolio</a></li>
            <li><a href="/courses.html" ${currentPath.includes('courses') ? 'class="active"' : ''}>Courses</a></li>
            <li><a href="/auth/login.html" class="accent-text">Portal</a></li>
          </ul>
          <a href="https://wa.me/919315778147" class="nav-cta" data-sound="hover">Book Session</a>
        </div>
      </header>
    `;

    this.initScrollListener();
  }

  initScrollListener() {
    const nav = this.querySelector('#main-nav');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }, { passive: true });
  }
}

class MCMFooter extends HTMLElement {
  connectedCallback() {
    const year = new Date().getFullYear();
    this.innerHTML = `
      <footer class="site-footer">
        <div class="footer-inner container">
          <div class="footer-top">
            <div class="brand-info">
              <h3 class="nav-logo">Middle Class Musicians</h3>
              <p style="color: var(--text-muted); margin-top: 1rem; max-width: 300px;">
                Professional recording, mixing, and beat production environment in Delhi.
              </p>
            </div>
            <div class="footer-links">
               </div>
          </div>
          <div class="footer-bottom">
            <span>&copy; ${year} Middle Class Musicians. All rights reserved.</span>
            <span>A venture by Wenon Bont & Bunny Nation Music</span>
          </div>
        </div>
      </footer>
    `;
  }
}

customElements.define('mcm-navbar', MCMNavbar);
customElements.define('mcm-footer', MCMFooter);
