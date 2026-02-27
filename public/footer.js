document.addEventListener("DOMContentLoaded", function () {

  const year = new Date().getFullYear();

  const footerHTML = `
  <footer>
    © ${year} AnonymousChat.live. All rights reserved.<br>
    Secure & private chat – no signup, no data stored.

    <div>
      <span>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#10b981" viewBox="0 0 24 24">
          <path d="M12 1L3 5v6c0 5.25 3.75 10.72 9 12 5.25-1.28 9-6.75 9-12V5l-9-4zM12 14c-1.66 0-3-1.34-3-3V8c0-1.66 1.34-3 3-3s3 1.34 3 3v3c0 1.66-1.34 3-3 3z"/>
        </svg>
      </span>

      <span>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#10b981" viewBox="0 0 24 24">
          <path d="M17 1H7c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm-5 21c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zM17 17H7V5h10v12z"/>
        </svg>
      </span>

      <span>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#10b981" viewBox="0 0 24 24">
          <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.12-.3 2.18-.82 3.09l1.46 1.46C19.11 15.52 20 13.84 20 12c0-4.42-3.58-8-8-8zm-6.36.64L4.22 2.5C2.69 3.92 2 5.86 2 8c0 4.42 3.58 8 8 8v3l4-4-4-4v3c-3.31 0-6-2.69-6-6 0-1.12.3-2.18.82-3.09z"/>
        </svg>
      </span>
    </div>
  </footer>
  `;

  document.body.insertAdjacentHTML("beforeend", footerHTML);

});
