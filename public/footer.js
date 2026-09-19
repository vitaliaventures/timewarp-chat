document.addEventListener("DOMContentLoaded", function () {

  const year = new Date().getFullYear();

  const footerHTML = `
    <footer>
      © ${year} Fade. All rights reserved.<br>
      <span>One-time notes & secrets — no signup, nothing stored after it's read.</span>

      <div style="margin-top:10px;">
        <a href="/privacy-policy.html" style="color:#10b981;text-decoration:none;margin:0 10px;">Privacy Policy</a>
        <a href="/terms-of-service.html" style="color:#10b981;text-decoration:none;margin:0 10px;">Terms of Service</a>
      </div>

      <div style="margin-top:10px;display:flex;justify-content:center;gap:16px;flex-wrap:wrap;font-size:12px;opacity:0.75;">
        <span>🔒 No signup</span>
        <span>⏱️ Self-destructs</span>
        <span>🚫 No tracking</span>
      </div>
    </footer>
  `;

  document.body.insertAdjacentHTML("beforeend", footerHTML);

});
