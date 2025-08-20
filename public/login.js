document.getElementById('login-form').onsubmit = function(e) {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
          // Show Go to Notes button
          const btn = document.createElement('button');
          btn.textContent = 'Go to Notes';
          btn.className = 'go-notes-btn';
          btn.onclick = function() {
            window.location.href = '/index.html';
          };
          document.getElementById('login-form').style.display = 'none';
          // Change heading to Welcome + first name!
          const heading = document.querySelector('.container h2');
          if (heading) {
            const firstName = data.firstName || '';
            heading.textContent = firstName ? `Welcome ${firstName}!` : 'Welcome!';
          }
          document.getElementById('login-error').textContent = '';
          document.getElementById('login-error').appendChild(btn);
      } else {
        document.getElementById('login-error').textContent = data.error || 'Login failed.';
      }
    });
};
