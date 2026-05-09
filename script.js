// ===== SECTIONS =====
const SECTIONS = ['inicio', 'licao1', 'licao2', 'licao3'];

function showSection(id) {
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link && link.classList.contains('nav-locked')) return;

    SECTIONS.forEach(sid => {
        document.getElementById(sid).classList.add('section-hidden');
    });

    document.getElementById(id).classList.remove('section-hidden');
    window.scrollTo({ top: 0, behavior: 'instant' });

    document.querySelectorAll('.nav-link').forEach(l => {
        l.classList.toggle('active', l.getAttribute('href') === '#' + id);
    });

    localStorage.setItem('currentSection', id);
}

// ===== LOCKS =====
function updateLocks() {
    const started = localStorage.getItem('started') === 'true';
    const c1 = document.getElementById('check1').checked;
    const c2 = document.getElementById('check2').checked;

    const nav = {
        licao1: document.querySelector('.nav-link[href="#licao1"]'),
        licao2: document.querySelector('.nav-link[href="#licao2"]'),
        licao3: document.querySelector('.nav-link[href="#licao3"]'),
    };

    if (nav.licao1) nav.licao1.classList.toggle('nav-locked', !started);
    if (nav.licao2) nav.licao2.classList.toggle('nav-locked', !c1);
    if (nav.licao3) nav.licao3.classList.toggle('nav-locked', !c2);
}

// ===== PROGRESS =====
function updateProgress() {
    const boxes = document.querySelectorAll('input[type="checkbox"]');
    const done  = [...boxes].filter(b => b.checked).length;
    const pct   = Math.round((done / boxes.length) * 100);

    document.getElementById('progressFill').style.width = pct + '%';
    document.getElementById('progressText').textContent = pct + '% concluído';

    boxes.forEach((b, i) => localStorage.setItem('ex' + i, b.checked));
    updateLocks();

    const complete = document.getElementById('courseComplete');
    if (done === boxes.length) {
        complete.classList.add('visible');
    } else {
        complete.classList.remove('visible');
    }
}

function loadProgress() {
    const boxes = document.querySelectorAll('input[type="checkbox"]');
    boxes.forEach((b, i) => {
        if (localStorage.getItem('ex' + i) === 'true') b.checked = true;
    });
}

// ===== START BUTTON =====
document.getElementById('btnStart').addEventListener('click', () => {
    localStorage.setItem('started', 'true');
    updateLocks();
    showSection('licao1');
});

// ===== SIDEBAR NAV =====
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('sidebarOverlay');
const toggle  = document.getElementById('sidebarToggle');

toggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('open');
});

overlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const id = link.getAttribute('href').slice(1);
        showSection(id);
        if (window.innerWidth <= 700) {
            sidebar.classList.remove('open');
            overlay.classList.remove('open');
        }
    });
});

// ===== PDF MODAL =====
function openPDF(path, title) {
    document.getElementById('pdfTitle').textContent = title;
    document.getElementById('pdfFrame').src = path;
    document.getElementById('pdfModal').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closePDF() {
    document.getElementById('pdfModal').classList.remove('open');
    document.getElementById('pdfFrame').src = '';
    document.body.style.overflow = '';
}

document.getElementById('pdfModal').addEventListener('click', function(e) {
    if (e.target === this) closePDF();
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closePDF();
});

// ===== INIT =====
loadProgress();
updateLocks();

// Restore last visited section
const saved = localStorage.getItem('currentSection');
if (saved && SECTIONS.includes(saved)) {
    showSection(saved);
} else {
    showSection('inicio');
}
