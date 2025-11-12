async function load() {
  const res = await fetch('data/notes.json');
  const all = await res.json();

  // Build subject filter buttons
  const subjects = [...new Set(all.map(n => n.subject))].sort();
  const subjectsNav = document.getElementById('subjects');
  subjectsNav.innerHTML = [
    `<button data-sel="all" class="active">All</button>`,
    ...subjects.map(s => `<button data-sel="${s}">${s.replace(/-/g,' ')}</button>`)
  ].join('');

  const container = document.getElementById('notes');
  const search = document.getElementById('search');

  let activeSubject = 'all';
  function render() {
    const q = (search.value || '').toLowerCase().trim();
    const filtered = all.filter(n => {
      const inSubject = activeSubject === 'all' || n.subject === activeSubject;
      const hay = [n.title, ...(n.tags||[]), n.subject].join(' ').toLowerCase();
      const inSearch = !q || hay.includes(q);
      return inSubject && inSearch;
    }).sort((a,b) => (b.updated||'').localeCompare(a.updated||''));
    container.innerHTML = filtered.map(n => `
      <article class="card">
        <h2><a href="${n.path}">${n.title}</a></h2>
        <p class="meta">${n.subject.replace(/-/g,' ')} · ${n.updated||''}</p>
        <p class="tags">${(n.tags||[]).map(t=>`<span>${t}</span>`).join(' ')}</p>
      </article>
    `).join('') || `<p>No notes match your search.</p>`;
  }

  subjectsNav.addEventListener('click', e => {
    if (e.target.tagName !== 'BUTTON') return;
    activeSubject = e.target.dataset.sel;
    [...subjectsNav.querySelectorAll('button')].forEach(b=>b.classList.toggle('active', b===e.target));
    render();
  });
  search.addEventListener('input', render);

  render();
}
load();
