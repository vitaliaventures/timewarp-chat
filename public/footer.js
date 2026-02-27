document.addEventListener("DOMContentLoaded", function () {
  const year = new Date().getFullYear();

  const footerHTML = `
  <div class="footer">
    © ${year} AnonymousChat.live. All rights reserved.<br>
    Secure & private chat – no signup, no data stored.

    <div class="footer-icons">
      <span>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#10b981" viewBox="0 0 24 24">
        <path d="M12 1L3 5v6c0 5.25 3.75 10.72 9 12 5.25-1.28 9-6.75 9-12V5l-9-4z"/>
        </svg>
      </span>
    </div>
  </div>
  `;

  document.querySelector(".wrapper").insertAdjacentHTML("beforeend", footerHTML);
});
