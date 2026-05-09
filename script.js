// ===== PROGRESS =====
function updateProgress() {
    const boxes = document.querySelectorAll('input[type="checkbox"]');
    const done  = [...boxes].filter(b => b.checked).length;
    const pct   = Math.round((done / boxes.length) * 100);

    document.getElementById('progressFill').style.width = pct + '%';
    document.getElementById('progressText').textContent = pct + '% concluído';

    const complete = document.getElementById('courseComplete');
    if (done === boxes.length) {
        complete.classList.add('visible');
        complete.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
        complete.classList.remove('visible');
    }

    boxes.forEach((b, i) => localStorage.setItem('ex' + i, b.checked));
}

function loadProgress() {
    const boxes = document.querySelectorAll('input[type="checkbox"]');
    boxes.forEach((b, i) => {
        if (localStorage.getItem('ex' + i) === 'true') b.checked = true;
    });
    updateProgress();
}

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

// ===== SIDEBAR (mobile) =====
const sidebar  = document.getElementById('sidebar');
const overlay  = document.getElementById('sidebarOverlay');
const toggle   = document.getElementById('sidebarToggle');

toggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('open');
});

overlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 700) {
            sidebar.classList.remove('open');
            overlay.classList.remove('open');
        }
    });
});

// ===== ACTIVE NAV ON SCROLL =====
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach(l => {
                l.classList.toggle('active', l.getAttribute('href') === '#' + id);
            });
        }
    });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => observer.observe(s));

// ===== INIT =====
loadProgress();
