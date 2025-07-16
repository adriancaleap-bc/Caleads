/* --------- logo --------- */
caleadsLogo.src = chrome.runtime.getURL('icon.png');

/* --------- evitar Ctrl+V bloqueado --------- */
document.querySelectorAll('#leadForm input')
  .forEach(i => i.addEventListener('keydown', e => e.stopPropagation()));

const leadForm = document.getElementById('leadForm');

leadForm.addEventListener('submit', e => {
  e.preventDefault();

  const btn  = leadForm.querySelector('button');
  const data = Object.fromEntries(new FormData(leadForm).entries());

  btn.disabled = true; btn.textContent = 'Saving…';

  chrome.runtime.sendMessage(
    { type: 'saveLead', payload: data },
    res => {
      const ok = res && res.ok;
      btn.classList.add(ok ? 'ok' : 'error');
      btn.textContent = ok ? 'Saved' : 'Error';
      if (ok) leadForm.reset();

      setTimeout(() => { btn.disabled=false; btn.className=''; btn.textContent='Save candidate'; }, 2000);
    }
  );
});
