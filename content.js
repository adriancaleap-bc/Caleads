// content.js
(function () {
  if (document.getElementById('caleads-sidebar')) return;

  /* --- Botón vertical --- */
  const tab = document.createElement('div');
  Object.assign(tab.style,{
    position:'fixed',right:'0',top:'35%',writingMode:'vertical-rl',
    background:'#007bff',color:'#fff',padding:'10px 8px',cursor:'pointer',
    borderTopLeftRadius:'6px',borderBottomLeftRadius:'6px',fontSize:'14px',
    zIndex:'2147483647'
  });
  tab.textContent='Caleads';

  /* --- Contenedor vacío --- */
  const panel=document.createElement('div');
  panel.id='caleads-sidebar';
  Object.assign(panel.style,{position:'fixed',top:'0',right:'0',
    width:'360px',height:'100vh',display:'none',zIndex:'2147483646'});

  /* --- Cargar HTML --- */
  fetch(chrome.runtime.getURL('sidebar.html'))
    .then(r=>r.text())
    .then(html=>{
      panel.innerHTML=html;
      initSidebar();
      document.body.append(tab,panel);
    });

  /* --- Abrir / cerrar --- */
  tab.addEventListener('click',()=>panel.style.display=
        panel.style.display==='none'?'block':'none');

  /* --- Drag opcional --- */
  let drag=false,off=0;
  tab.addEventListener('mousedown',e=>{drag=true;off=e.clientY-tab.getBoundingClientRect().top;e.preventDefault();});
  document.addEventListener('mousemove',e=>{if(!drag)return;tab.style.top=Math.max(0,Math.min(window.innerHeight-100,e.clientY-off))+'px';});
  document.addEventListener('mouseup',()=>drag=false);

  /* ---------- Inicialización del formulario ---------- */
  function initSidebar(){
    // Logo
    panel.querySelector('#caleadsLogo').src = chrome.runtime.getURL('icon.png');

    // Evitar que LinkedIn capture ctrl+v
    panel.querySelectorAll('input')
         .forEach(i=>i.addEventListener('keydown',e=>e.stopPropagation()));

    // Envío a Google Sheets
    const SHEET_URL='https://script.google.com/macros/s/AKfycbxh_3ULEHiXisqeC3wxbLAzntw-KEJsXelxsAS8UHmAH2yKPl_4I0_JW3Xyhc2jI680HA/exec';
    const form=panel.querySelector('#leadForm');

    form.addEventListener('submit',async e=>{
      e.preventDefault();
      const data=Object.fromEntries(new FormData(form).entries());

      await fetch(SHEET_URL,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(data),
        mode:'no-cors'
      });

      alert('✅ Guardado en Google Sheets');
      form.reset();
    });
  }
})();
