// content.js – barra lateral Caleads (versión sin alert)
(function () {
  if (document.getElementById('caleads-sidebar')) return;

  /* ---------- Botón vertical ---------- */
  const tab = document.createElement('div');
  Object.assign(tab.style, {
    position:'fixed', right:'0', top:'35%',
    writingMode:'vertical-rl', background:'#007bff', color:'#fff',
    padding:'10px 8px', cursor:'pointer', fontSize:'14px',
    borderTopLeftRadius:'6px', borderBottomLeftRadius:'6px',
    zIndex:'2147483647'
  });
  tab.textContent = 'Caleads';

  /* ---------- Contenedor vacío ---------- */
  const panel = document.createElement('div');
  panel.id = 'caleads-sidebar';
  Object.assign(panel.style, {
    position:'fixed', top:'0', right:'0',
    width:'360px', height:'100vh', display:'none',
    zIndex:'2147483646'
  });

  /* ---------- Cargar HTML ---------- */
  fetch(chrome.runtime.getURL('sidebar.html'))
    .then(r => r.text())
    .then(html => {
      panel.innerHTML = html;
      initSidebar();
      document.body.append(tab, panel);
    });

  /* Abrir / cerrar */
  tab.addEventListener('click',
    () => panel.style.display = panel.style.display === 'none' ? 'block' : 'none');

  /* Drag del botón vertical */
  let drag = false, off = 0;
  tab.addEventListener('mousedown', e => { drag = true; off = e.clientY - tab.getBoundingClientRect().top; e.preventDefault();});
  document.addEventListener('mousemove', e => {
    if (!drag) return;
    tab.style.top = Math.max(0, Math.min(window.innerHeight - 100, e.clientY - off)) + 'px';
  });
  document.addEventListener('mouseup', () => drag = false);

  /* ---------- Inicialización ---------- */
  function initSidebar () {

    /*  Logo correcto  */
    panel.querySelector('#caleadsLogo').src = chrome.runtime.getURL('icon.png');

    /*  Evitar que LinkedIn capture Ctrl+V  */
    panel.querySelectorAll('input')
         .forEach(i => i.addEventListener('keydown', e => e.stopPropagation()));

    /*  Config Sheets  */
    const SHEET_URL =
      'https://script.google.com/macros/s/AKfycbxWepNkArQ_1jUx5eXnqTT6_-mShA_w3cSn_OFXZIG4Tm2MBajF1P2izBazdrY5dzGy9g/exec'; // Reemplaza con la nueva URL

    const form = panel.querySelector('#leadForm');
    const btn  = form.querySelector('button[type="submit"]');
    const okColor   = '#28a745', baseColor = '#007bff';

    form.addEventListener('submit', async e => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());

      console.log('Datos enviados:', data); // Registrar los datos enviados

      try {
        const response = await fetch(SHEET_URL, {
          method :'POST',
          headers:{ 'Content-Type':'application/json' },
          body   : JSON.stringify(data),
          mode   :'cors'
        });

        console.log('Estado de la respuesta:', response.status); // Registrar el estado de la respuesta

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        console.log('Respuesta del servidor:', result);

        /* feedback verde */
        btn.disabled = true;
        const txt = btn.textContent;
        btn.textContent      = 'Candidate saved';
        btn.style.background = okColor;
        setTimeout(() => {
          btn.disabled         = false;
          btn.textContent      = txt;
          btn.style.background = baseColor;
        }, 2000);

        form.reset();
      } catch (error) {
        console.error('Error al enviar datos:', error);
        alert(`Error al guardar el candidato: ${error.message}. Revisa la consola para más detalles.`);
      }
    });
  }
})();
