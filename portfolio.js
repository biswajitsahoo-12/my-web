// Fade-in sections on scroll (safe)
(function () {
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.2 });
    sections.forEach(s => observer.observe(s));
})();

// Smooth scroll util (renamed to avoid clashing with window.scrollTo)
function smoothScrollTo(selector) {
    if (!selector || typeof selector !== 'string') return;
    try {
        const el = document.querySelector(selector);
        if (el && typeof el.scrollIntoView === 'function') {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            console.warn('smoothScrollTo: selector not found or element has no scrollIntoView ->', selector);
        }
    } catch (err) { console.warn('smoothScrollTo error', err) }
}

// wire up hero "View Projects" button safely
(function () {
    const btn = document.getElementById('viewProjectsBtn');
    if (btn) btn.addEventListener('click', () => smoothScrollTo('#projects'));
})();

// Theme toggle (safe)
(function () {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    themeToggle.addEventListener('click', () => document.body.classList.toggle('light'));
})();

// Resume button (download placeholder) - safe
(function () {
    const resumeBtn = document.getElementById('resumeBtn');
    if (!resumeBtn) return;
    resumeBtn.addEventListener('click', () => {
        const link = document.createElement('a'); link.href = 'resume.pdf'; link.download = 'Biswajit_Sahoo_Resume.pdf'; document.body.appendChild(link); link.click(); link.remove();
    });
})();

// THREE.JS: initialize only if canvas present
(function () {
    const canvas = document.getElementById('threecanvas');
    if (!canvas) return;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000); camera.position.z = 4;
    const light = new THREE.DirectionalLight(0xffffff, 1); light.position.set(5, 5, 5); scene.add(light);
    const geom = new THREE.IcosahedronGeometry(1.2, 1);
    const mat = new THREE.MeshStandardMaterial({ color: 0x00f5a0, transparent: true, opacity: 0.95, roughness: 0.2, metalness: 0.2 });
    const mesh = new THREE.Mesh(geom, mat); scene.add(mesh);
    const rendererResize = () => { try { const w = canvas.clientWidth || 600; renderer.setSize(w, 360); camera.aspect = w / 360; camera.updateProjectionMatrix(); } catch (e) { console.warn('three resize', e); } };
    window.addEventListener('resize', rendererResize); rendererResize();
    (function animate() { mesh.rotation.x += 0.005; mesh.rotation.y += 0.007; try { renderer.render(scene, camera); } catch (e) { /* renderer may fail on unsupported devices */ } requestAnimationFrame(animate); })();
})();

// GitHub stats (safe)
(async function () {
    const ghUser = 'your-github-username';
    const el = document.getElementById('ghstats');
    if (!el) return;
    try {
        if (!ghUser || ghUser === 'your-github-username') { el.textContent = 'Set your GitHub username in the script to load stats.'; return; }
        const res = await fetch(`https://api.github.com/users/${ghUser}`);
        if (!res.ok) throw new Error('GitHub fetch failed');
        const data = await res.json();
        el.innerHTML = `⭐ ${data.public_repos} repos • ${data.followers} followers`;
    } catch (e) { el.textContent = 'GitHub data not available'; console.warn(e) }
})();

// Radar chart (safe)
(function () {
    const radarEl = document.getElementById('radar');
    if (!radarEl) return;
    let ctx = null;
    try { ctx = radarEl.getContext('2d'); } catch (e) { console.warn('Radar canvas not usable', e); return; }
    new Chart(ctx, {
        type: 'radar',
        data: { labels: ['Python', 'ML', 'React', 'SQL', 'Docker'], datasets: [{ label: 'Proficiency', data: [85, 78, 70, 75, 60], fill: true, backgroundColor: 'rgba(0,245,160,0.3)', borderColor: '#00f5a0' }] },
        options: { scales: { r: { ticks: { display: false }, suggestedMax: 100 } }, plugins: { legend: { display: false } } }
    });
})();

// Projects filter function (kept global for inline onclick handlers)
function filterProjects(type) {
    const projects = document.querySelectorAll('.project');
    if (!projects) return;
    projects.forEach(p => { if (type === 'all') p.style.display = 'block'; else p.style.display = (p.dataset.type === type) ? 'block' : 'none'; });
}

// Case studies modal (safe)
function openCaseStudy(id) {
    const modal = document.getElementById('modal'); const content = document.getElementById('modalContent');
    if (!modal || !content) return;
    const cases = {
        sales: `<h2>Sales Dashboard — Case Study</h2><p><strong>Problem:</strong> Clients needed a single dashboard to monitor sales KPIs.</p><p><strong>Solution:</strong> Built a React front-end with Plotly visualisations and a Flask API to serve aggregated metrics. Techniques: smoothing, aggregation, lazy-loading charts.</p>`,
        movie: `<h2>Movie Recommender — Case Study</h2><p><strong>Problem:</strong> Help users find relevant movies using sparse ratings.</p><p><strong>Solution:</strong> Hybrid recommender combining content embeddings + collaborative filtering. Deployed with Flask and served simple React UI.</p>`,
        portfolio: `<h2>Portfolio</h2><p>This portfolio showcases projects, live GitHub integration, and interactive visualisations. Built with vanilla JS — can be migrated to Next.js easily.</p>`
    };
    content.innerHTML = cases[id] || '<p>Case study coming soon.</p>';
    modal.style.display = 'flex';
}
function closeModal() { const modal = document.getElementById('modal'); if (modal) modal.style.display = 'none'; }

// Contact form (safe)
(function () {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const status = document.getElementById('contactStatus'); if (status) status.textContent = 'Sending...';
        try { await new Promise(r => setTimeout(r, 900)); if (status) status.textContent = 'Message sent — I will reply soon!'; }
        catch (err) { if (status) status.textContent = 'Failed to send. Please email directly.'; }
    });
})();

// Typing effect hero (safe)
(function () {
    const el = document.getElementById('typing'); if (!el) return;
    const roles = ['I Build Intelligent Apps — Data Science • Web Dev • AI', 'Data Enthusiast', 'Problem Solver', 'Open to internships'];
    let rIdx = 0, cIdx = 0, deleting = false;
    function tick() {
        const cur = roles[rIdx];
        if (!deleting) { el.textContent = cur.slice(0, cIdx + 1); cIdx++; if (cIdx === cur.length) { deleting = true; setTimeout(tick, 900); return; } }
        else { el.textContent = cur.slice(0, cIdx - 1); cIdx--; if (cIdx === 0) { deleting = false; rIdx = (rIdx + 1) % roles.length; } }
        setTimeout(tick, deleting ? 50 : 80);
    }
    tick();
})();

// Small UX: wire viewProjectsBtn to smoothScrollTo
(function () { const v = document.getElementById('viewProjectsBtn'); if (v) v.addEventListener('click', () => smoothScrollTo('#projects')); })();
