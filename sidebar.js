const form = document.getElementById('leadForm');
form.addEventListener('submit', function(e) {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  chrome.runtime.sendMessage({ type: 'saveLead', payload: data }, function(response) {
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    if (response && response.ok) {
      btn.textContent = 'Candidate saved';
      btn.style.background = '#28a745';
      form.reset();
    } else {
      btn.textContent = 'Error';
      btn.style.background = '#dc3545';
    }
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '#007bff';
    }, 1800);
  });
});
