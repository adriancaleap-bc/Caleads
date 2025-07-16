const SHEET_URL = 'https://script.google.com/macros/s/AKfycbyrAWjfajapklSavFAEHGICqfLmrq3b2wRwJygj4aNJJ_l1hNmGrl54LezocgSQGdc9eg/exec';

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type !== 'saveLead') return;
  fetch(SHEET_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(msg.payload)
  })
    .then(r => r.json().catch(() => ({})))
    .then(data => sendResponse({ ok: true, data }))
    .catch(err => sendResponse({ ok: false, error: err.message }));
  return true; // Para respuesta async
});
