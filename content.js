// content.js – inyecta panel y pasa datos al service‑worker
(function () {
  if (document.getElementById('caleads-sidebar')) return;

  /* -------- botón -------- */
  const tab = document.createElement('div');
  Object.assign(tab.style, {
    position: 'fixed', right: 0, top: '35%',
    writingMode: 'vertical-rl', background: '#007bff', color: '#fff',
    padding: '10px 8px', cursor: 'pointer', fontSize: '14px',
    borderTopLeftRadius: '6px', borderBottomLeftRadius: '6px',
    zIndex: 2147483647
  });
  tab.textContent = 'Caleads';

  /* -------- panel (HTML externo) -------- */
  const iframe = document.createElement('iframe');
  iframe.id = 'caleads-sidebar';
  iframe.src = chrome.runtime.getURL('sidebar.html');
  Object.assign(iframe.style, {
    position: 'fixed', top: 0, right: 0, width: '360px', height: '100vh',
    border: 'none', display: 'none', zIndex: 2147483646
  });

  document.body.append(tab, iframe);
  tab.onclick = () => iframe.style.display =
    iframe.style.display === 'none' ? 'block' : 'none';

  /* arrastrar el tab */
  let drag = false, off = 0;
  tab.onmousedown = e => { drag = true; off = e.clientY - tab.getBoundingClientRect().top; e.preventDefault(); };
  document.onmousemove = e => drag && (tab.style.top =
    Math.max(0, Math.min(window.innerHeight - 100, e.clientY - off)) + 'px');
  document.onmouseup = () => drag = false;

  // Escuchar mensajes desde el iframe
  window.addEventListener('message', (event) => {
    if (event.origin !== chrome.runtime.getURL('').slice(0, -1)) return; // Validar origen

    const { type, data } = event.data;
    if (type === 'saveLead') {
      chrome.runtime.sendMessage({ type: 'saveLead', data }, (response) => {
        if (response.success) {
          console.log('Lead guardado correctamente:', response.message);
        } else {
          console.error('Error al guardar el lead:', response.message);
        }
      });
    }
  });
})();
