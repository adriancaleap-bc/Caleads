// background.js
const SHEET_URL =
  'https://script.google.com/macros/s/AKfycbz91koINh6pC8VXroBmy_ujWa_IW_FWFwpdskcuIGGsRBqJghig3EveOlppsmrbzHvIuQ/exec';

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type !== 'saveLead') return;

  fetch(SHEET_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(msg.payload)
  })
    .then(r => r.json().catch(() => ({})))
    .then(data => sendResponse({ ok: true, data }))
    .catch(err => {
      console.error('saveLead error:', err);
      sendResponse({ ok: false, err: err.message });
    });

  // Indicar que respondemos de forma asíncrona
  return true;
});
