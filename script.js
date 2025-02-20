// Smooth scrolling
document.querySelectorAll('.nav-links a, .back-to-top').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
    });
});

// Dark/Light Mode Toggle
const body = document.body;
const toggle = document.querySelector('.mode-toggle');
toggle.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    localStorage.setItem('mode', body.classList.contains('light-mode') ? 'light' : 'dark');
    updateQRCode(); // Update QR code colors on mode toggle
});

if (localStorage.getItem('mode') === 'light') body.classList.add('light-mode');

// Matrix Background
const canvas = document.getElementById('matrix-bg');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*';
const fontSize = 16;
const columns = canvas.width / fontSize;
const drops = Array(Math.floor(columns)).fill(1);

function drawMatrix() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = body.classList.contains('light-mode') ? '#008080' : '#00ffcc';
    ctx.font = `${fontSize}px 'Roboto Mono'`;
    for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
    }
}
setInterval(drawMatrix, 50);

// Terminal About Animation
const aboutText = [
    '> 2023: Booted up at Epitech',
    '> 2024: Deployed Full Stack skills',
    '> 2025: Ready to dominate'
];
let lineIndex = 0;
const aboutP = document.getElementById('terminal-about');
function typeAbout() {
    if (lineIndex < aboutText.length) {
        aboutP.textContent = aboutText[lineIndex];
        aboutP.style.animation = 'typing 1s steps(30)';
        lineIndex++;
        setTimeout(() => aboutP.style.animation = '', 1000);
        setTimeout(typeAbout, 2000);
    } else {
        lineIndex = 0;
        setTimeout(typeAbout, 2000);
    }
}
typeAbout();

// Skills Radar Chart
const skillsChart = new Chart(document.getElementById('skills-chart'), {
    type: 'radar',
    data: {
        labels: ['Front-End', 'Back-End', 'Databases', 'Tools', 'Soft Skills'],
        datasets: [{
            label: 'Skill Levels',
            data: [90, 85, 80, 75, 95], // Adjust these based on your self-assessment
            backgroundColor: 'rgba(0, 255, 204, 0.2)',
            borderColor: '#00ffcc',
            borderWidth: 2
        }]
    },
    options: {
        scales: {
            r: { angleLines: { color: '#ff007a' }, grid: { color: '#666' } }
        }
    }
});

// Code Stats
const loc = document.getElementById('loc');
const commits = document.getElementById('commits');
let locCount = 42000;
let commitCount = 512;
setInterval(() => {
    locCount += Math.floor(Math.random() * 10);
    commitCount += Math.floor(Math.random() * 3);
    loc.textContent = locCount.toLocaleString();
    commits.textContent = commitCount.toLocaleString();
}, 5000);

// Dynamic GitHub Stats
fetch('https://api.github.com/users/Mahmoud-Mh')
    .then(response => response.json())
    .then(data => {
        document.getElementById('github-stats').innerHTML = `Repos: ${data.public_repos} | Followers: ${data.followers}`;
    })
    .catch(error => {
        console.error('Error fetching GitHub data:', error);
        document.getElementById('github-stats').textContent = 'GitHub stats unavailable';
    });

// QR Code
function updateQRCode() {
    document.getElementById('qr-code').innerHTML = '';
    new QRCode(document.getElementById('qr-code'), {
        text: 'mailto:mahmoud.mouzoun@epitech.eu',
        width: 150,
        height: 150,
        colorDark: body.classList.contains('light-mode') ? '#008080' : '#00ffcc',
        colorLight: body.classList.contains('light-mode') ? '#e0e0e0' : '#1f1f1f'
    });
}
updateQRCode();

// Terminal Easter Egg
function checkTerminal(event) {
    if (event.key === 'Enter') {
        const input = document.getElementById('terminal-input');
        if (input.value.toLowerCase() === 'hello') {
            alert('Hey there! Let’s code something epic.');
            input.value = '';
        } else {
            input.value = '> Try "hello"';
        }
    }
}

// Konami Code
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;
document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            document.body.style.background = 'linear-gradient(45deg, #ff007a, #00ffcc)';
            setTimeout(() => document.body.style.background = body.classList.contains('light-mode') ? '#f5f5f5' : '#0d0d0d', 3000);
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

// Fade-in Animations
const sections = document.querySelectorAll('.animate-section');
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, { threshold: 0.1 });

sections.forEach(section => observer.observe(section));

// Console Easter Egg
console.log('%cYo, dev! Want to hack the future with me?', 'color: #00ffcc; font-size: 20px; text-shadow: 0 0 5px #ff007a;');