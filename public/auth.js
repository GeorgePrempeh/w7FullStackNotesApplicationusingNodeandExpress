// Check authentication status and update UI
function checkAuth() {
  fetch('/api/auth-check')
    .then(res => res.json())
    .then(data => {
      if (data.authenticated) {
        document.body.classList.add('logged-in');
        // Optionally show username or logout button
      } else {
        document.body.classList.remove('logged-in');
        // Optionally redirect to login page
      }
    });
}

// Call on page load
checkAuth();
