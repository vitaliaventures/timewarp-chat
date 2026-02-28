document.addEventListener("DOMContentLoaded", function () {

  const year = new Date().getFullYear();

  const footerHTML = `
    <footer>
      © ${year} AnonymousChat.live. All rights reserved.<br>
      <span>Secure & private chat – no signup, no data stored.</span>

      <div>
        <span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12 1L3 5v6c0 5.25 3.75 10.72 9 12 5.25-1.28 9-6.75 9-12V5l-9-4z"/>
          </svg>
        </span>

        <span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M17 1H7c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2z"/>
          </svg>
        </span>

        <span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.12-.3 2.18-.82 3.09l1.46 1.46C19.11 15.52 20 13.84 20 12c0-4.42-3.58-8-8-8z"/>
          </svg>
        </span>
      </div>
    </footer>
  `;

  document.body.insertAdjacentHTML("beforeend", footerHTML);

});
