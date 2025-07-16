const SHEET_URL =
  'https://script.google.com/macros/s/AKfycbw4g2VG7aAyT-W-2fz6maRFy19Q9PCX7V0DlCrwt8gjIkQGEXuAZjHBYht747e7XoKfKA/exec';

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type !== 'saveLead') return;

  fetch(SHEET_URL, {
    method : 'POST',
    // ‑‑ QUITAMOS el header para evitar pre‑flight
    // headers: { 'Content-Type':'application/json' },
    body   : JSON.stringify(msg.payload),  // se envía como text/plain
    mode   : 'no-cors'                     // evita CORS/pre‑flight
  })
  .then(() => sendResponse({ ok:true }))   // respuesta siempre OK
  .catch(err=>{
      console.error('saveLead error:', err);
      sendResponse({ ok:false, err: err.message });
  });

  return true;                             // keep port open (async)
});
