document.addEventListener("DOMContentLoaded", function () {

  const year = new Date().getFullYear();

  const footerHTML = `
    <footer class="site-footer">
      <div class="footer-content">
        <div class="footer-text">
          © ${year} AnonymousChat.live. All rights reserved.
          <br>
          <span>Secure • Private • No signup • No data stored</span>
        </div>

        <div class="footer-icons">

          <!-- Privacy / Shield -->
          <span class="footer-icon" title="End-to-End Privacy" aria-label="End-to-End Privacy">
            <svg viewBox="0 0 24 24">
              <path d="M12 2L4 5v6c0 5.2 3.4 9.8 8 11 4.6-1.2 8-5.8 8-11V5l-8-3z"/>
              <path d="M9.5 12.5l1.5 1.5 3-3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </span>

          <!-- Instant / Lightning -->
          <span class="footer-icon" title="Instant Messaging" aria-label="Instant Messaging">
            <svg viewBox="0 0 24 24">
              <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/>
            </svg>
          </span>

          <!-- Global / Globe -->
          <span class="footer-icon" title="Global Access" aria-label="Global Access">
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/>
              <path d="M2 12h20M12 2c3 3 3 17 0 20M12 2c-3 3-3 17 0 20" fill="none" stroke="currentColor" stroke-width="1.5"/>
            </svg>
          </span>

        </div>
      </div>
    </footer>
  `;

  document.body.insertAdjacentHTML("beforeend", footerHTML);

});
