document.getElementById('register-form').onsubmit = function(e) {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        window.location.href = '/login.html';
      } else {
        document.getElementById('register-error').textContent = data.error || 'Registration failed.';
      }
    });
};
