(function () {
  if (document.getElementById('caleads-sidebar')) return;

  const tab = document.createElement('div');
  Object.assign(tab.style, {
    position:'fixed', right:'0', top:'35%',
    writingMode:'vertical-rl', background:'#007bff', color:'#fff',
    padding:'10px 8px', cursor:'pointer', fontSize:'14px',
    borderTopLeftRadius:'6px', borderBottomLeftRadius:'6px',
    zIndex:'2147483647'
  });
  tab.textContent = 'Caleads';

  const panel = document.createElement('div');
  panel.id = 'caleads-sidebar';
  Object.assign(panel.style, {
    position:'fixed', top:'0', right:'0',
    width:'360px', height:'100vh', display:'none',
    zIndex:'2147483646'
  });

  fetch(chrome.runtime.getURL('sidebar.html'))
    .then(r => r.text())
    .then(html => {
      panel.innerHTML = html;
      document.body.append(tab, panel);
    });

  tab.addEventListener('click', () =>
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none'
  );

  let drag = false, off = 0;
  tab.addEventListener('mousedown', e => { drag = true; off = e.clientY - tab.getBoundingClientRect().top; e.preventDefault();});
  document.addEventListener('mousemove', e => {
    if (!drag) return;
    tab.style.top = Math.max(0, Math.min(window.innerHeight - 100, e.clientY - off)) + 'px';
  });
  document.addEventListener('mouseup', () => drag = false);
})();
