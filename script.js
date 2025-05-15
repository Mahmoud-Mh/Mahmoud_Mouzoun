// Smooth scrolling with animation
document.querySelectorAll('.nav-links a, .back-to-top, .logo a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId.startsWith('#')) {
            const targetElement = document.querySelector(targetId);
            const startPosition = window.pageYOffset;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
            const distance = targetPosition - startPosition;
            const duration = 1000; // ms
            let start = null;
            
            function animation(currentTime) {
                if (start === null) start = currentTime;
                const timeElapsed = currentTime - start;
                const progress = Math.min(timeElapsed / duration, 1);
                const easeProgress = 0.5 - Math.cos(progress * Math.PI) / 2; // Smooth easing
                window.scrollTo(0, startPosition + distance * easeProgress);
                if (timeElapsed < duration) {
                    requestAnimationFrame(animation);
                }
            }
            
            requestAnimationFrame(animation);
        }
    });
});

// Dark/Light Mode Toggle
const body = document.body;
const toggle = document.querySelector('.mode-toggle');
toggle.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    localStorage.setItem('mode', body.classList.contains('light-mode') ? 'light' : 'dark');
    updateQRCode(); // Update QR code colors on mode toggle
    
    // Update chart colors when mode changes
    if (skillsChart) {
        const isDarkMode = !body.classList.contains('light-mode');
        skillsChart.options.scales.r.angleLines.color = isDarkMode ? '#ff007a' : '#ff69b4';
        skillsChart.options.scales.r.grid.color = isDarkMode ? '#666' : '#ccc';
        skillsChart.data.datasets[0].borderColor = isDarkMode ? '#00ffcc' : '#008080';
        skillsChart.update();
    }
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
const timelineContainer = document.querySelector('.timeline');

// Ensure the timeline container is tall enough for the largest text
function adjustTimelineHeight() {
    // Create a temporary element to measure text height
    const tempText = document.createElement('p');
    tempText.style.cssText = 'position:absolute; visibility:hidden; font-size:1.2em; font-family:"Roboto Mono", monospace; white-space:nowrap;';
    document.body.appendChild(tempText);
    
    // Find the tallest height among all texts
    let maxHeight = 0;
    aboutText.forEach(text => {
        tempText.textContent = text;
        maxHeight = Math.max(maxHeight, tempText.offsetHeight);
    });
    
    // Add some padding
    timelineContainer.style.height = (maxHeight + 10) + 'px';
    document.body.removeChild(tempText);
}

// Call once on page load
adjustTimelineHeight();

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
let skillsChart;

function initSkillsChart() {
    // Destroy previous chart if it exists
    if (skillsChart) {
        skillsChart.destroy();
    }
    
    // Create new chart
    skillsChart = new Chart(document.getElementById('skills-chart'), {
        type: 'radar',
        data: {
            labels: ['Front-End', 'Back-End', 'Databases', 'Tools', 'Soft Skills'],
            datasets: [{
                label: 'Skill Levels',
                data: [78, 83, 85, 70, 60], // Updated skill values as requested
                backgroundColor: 'rgba(0, 255, 204, 0.2)',
                borderColor: '#00ffcc',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                r: { 
                    angleLines: { color: '#ff007a' }, 
                    grid: { color: '#666' },
                    ticks: { display: false }, // Hide number labels
                    pointLabels: {
                        font: {
                            size: 14,
                            family: "'Roboto Mono', monospace"
                        }
                    },
                    min: 0,
                    max: 100,
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: false // Hide legend
                }
            }
        }
    });
}

// Initialize chart
initSkillsChart();

// Re-render chart on window resize
window.addEventListener('resize', () => {
    initSkillsChart();
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

// Add index to project cards for staggered animation
document.querySelectorAll('.project-card').forEach((card, index) => {
    card.style.setProperty('--card-index', index);
});

// Language Toggle
const langToggle = document.querySelector('.lang-toggle');
const translations = {
    'en': {
        // Navigation
        'nav-home': 'Home',
        'nav-about': 'About',
        'nav-skills': 'Skills',
        'nav-experience': 'Experience',
        'nav-education': 'Education',
        'nav-projects': 'Projects',
        'nav-contact': 'Contact',
        
        // Hero Section
        'hero-title': 'Full Stack Developer',
        'hero-tagline': 'Unleashing Code That Scales & Sparks ⚡',
        'hero-cta': 'Let\'s Build Something',
        
        // About Section
        'about-title': 'About Me',
        'about-text': 'Web developer passionate about innovation and custom solutions. Currently looking for an apprenticeship starting from January 2025, I wish to collaborate with mentors to develop high-performance web applications and explore cutting-edge technologies.',
        'about-timeline1': '> 2023: Booted up at Epitech',
        'about-timeline2': '> 2024: Deployed Full Stack skills',
        'about-timeline3': '> 2025: Ready to dominate',
        
        // Skills Section
        'skills-title': 'Skill Matrix',
        'skills-code-pulse': 'Code Pulse',
        'skills-loc': 'Lines of Code',
        'skills-commits': 'Commits',
        'skills-prog-lang': 'Programming Languages',
        'skills-frontend': 'Frontend',
        'skills-backend': 'Backend & Frameworks',
        'skills-databases': 'Databases',
        'skills-tools': 'Tools & Methods',
        'skills-languages': 'Languages',
        'skills-qualities': 'Qualities',
        
        // Experience Section
        'experience-title': 'Professional Experience',
        'experience-sfve-title': 'SFVE',
        'experience-sfve-position': 'AI Developer Intern',
        'experience-sfve-desc': 'Development of web applications, collaboration with multidisciplinary teams, integration of innovative AI technologies.',
        'experience-srtim-title': 'SRTIMCom',
        'experience-srtim-position': 'Full Stack Developer Intern',
        'experience-srtim-desc': 'Worked on optimizing business processes through personalized solutions.',
        'experience-wilaya-title': 'Wilaya D\'Errachidia',
        'experience-wilaya-position': 'Data Analyst Intern',
        'experience-wilaya-desc': 'Analyzing and processing data to extract meaningful insights.',
        
        // Education Section
        'education-title': 'Education',
        'education-epitech-title': 'Master of Science Pro | EPITECH',
        'education-epitech-spec': 'IT Systems Architect',
        'education-epitech-level': 'RNCP Level 7',
        'education-ensa-title': 'Licence Professionnelle | ENSA',
        'education-ensa-spec': 'Big Data',
        'education-bts-title': 'BTS Ordiciel',
        'education-bts-spec': 'Computer Development',
        
        // Projects Section
        'projects-title': 'Project Vault',
        'project-trelltech-title': 'TrellTech',
        'project-trelltech-desc': 'A Trello-like project management system with dynamic user assignment and responsive interface.',
        'project-trelltech-tech': 'Tech: TypeScript, React, MongoDB, REST API',
        'project-marvin-title': 'My_Marvin',
        'project-marvin-desc': 'Advanced Jenkins configuration via JCasC and DSL, creating automated CI/CD pipelines with role-based access control in YAML.',
        'project-marvin-tech': 'Tech: Jenkins, JCasC, Job DSL, YAML, Docker',
        'project-tweet-title': 'Tweet',
        'project-tweet-desc': 'Real-time chat platform inspired by IRC, with channel management, user permissions and advanced features.',
        'project-tweet-tech': 'Tech: Nest.JS, React, TypeScript, MongoDB, Socket.io',
        'project-view': 'View on GitHub',
        
        // Contact Section
        'contact-title': 'Plug In',
        'contact-location': 'Montpellier, France'
    },
    'fr': {
        // Navigation
        'nav-home': 'Accueil',
        'nav-about': 'À Propos',
        'nav-skills': 'Compétences',
        'nav-experience': 'Expérience',
        'nav-education': 'Formation',
        'nav-projects': 'Projets',
        'nav-contact': 'Contact',
        
        // Hero Section
        'hero-title': 'Développeur Full Stack',
        'hero-tagline': 'Du Code Qui Évolue & Inspire ⚡',
        'hero-cta': 'Créons Ensemble',
        
        // About Section
        'about-title': 'À Propos de Moi',
        'about-text': 'Développeur web passionné par l\'innovation et les solutions sur mesure. Actuellement à la recherche d\'une alternance à partir de janvier 2025, je souhaite collaborer avec des mentors pour développer des applications web performantes et explorer des technologies de pointe.',
        'about-timeline1': '> 2023: Démarrage à Epitech',
        'about-timeline2': '> 2024: Maîtrise Full Stack',
        'about-timeline3': '> 2025: Prêt à dominer',
        
        // Skills Section
        'skills-title': 'Matrice de Compétences',
        'skills-code-pulse': 'Pulsation de Code',
        'skills-loc': 'Lignes de Code',
        'skills-commits': 'Commits',
        'skills-prog-lang': 'Langages de Programmation',
        'skills-frontend': 'Frontend',
        'skills-backend': 'Backend & Frameworks',
        'skills-databases': 'Bases de Données',
        'skills-tools': 'Outils & Méthodes',
        'skills-languages': 'Langues',
        'skills-qualities': 'Qualités',
        
        // Experience Section
        'experience-title': 'Expérience Professionnelle',
        'experience-sfve-title': 'SFVE',
        'experience-sfve-position': 'Stagiaire Développeur IA',
        'experience-sfve-desc': 'Développement d\'applications web, collaboration avec des équipes pluridisciplinaires, intégration de technologies IA innovantes.',
        'experience-srtim-title': 'SRTIMCom',
        'experience-srtim-position': 'Stagiaire Développeur Full Stack',
        'experience-srtim-desc': 'Optimisation des processus métier via des solutions personnalisées.',
        'experience-wilaya-title': 'Wilaya D\'Errachidia',
        'experience-wilaya-position': 'Stagiaire Analyste de Données',
        'experience-wilaya-desc': 'Analyse et traitement de données pour extraire des informations pertinentes.',
        
        // Education Section
        'education-title': 'Formation',
        'education-epitech-title': 'Master of Science Pro | EPITECH',
        'education-epitech-spec': 'Architecte Système Informatique',
        'education-epitech-level': 'RNCP Niveau 7',
        'education-ensa-title': 'Licence Professionnelle | ENSA',
        'education-ensa-spec': 'Big Data',
        'education-bts-title': 'BTS Ordiciel',
        'education-bts-spec': 'Développement Informatique',
        
        // Projects Section
        'projects-title': 'Vitrine de Projets',
        'project-trelltech-title': 'TrellTech',
        'project-trelltech-desc': 'Un système de gestion de projet type Trello avec attribution dynamique des utilisateurs et interface responsive.',
        'project-trelltech-tech': 'Tech: TypeScript, React, MongoDB, API REST',
        'project-marvin-title': 'My_Marvin',
        'project-marvin-desc': 'Configuration avancée de Jenkins via JCasC et DSL, création de pipelines CI/CD automatisés avec gestion des accès par rôles en YAML.',
        'project-marvin-tech': 'Tech: Jenkins, JCasC, Job DSL, YAML, Docker',
        'project-tweet-title': 'Tweet',
        'project-tweet-desc': 'Plateforme de chat en temps réel inspirée d\'IRC, avec gestion des salons, permissions utilisateurs et fonctionnalités avancées.',
        'project-tweet-tech': 'Tech: Nest.JS, React, TypeScript, MongoDB, Socket.io',
        'project-view': 'Voir sur GitHub',
        
        // Contact Section
        'contact-title': 'Contactez-moi',
        'contact-location': 'Montpellier, France'
    }
};

// Set timeline texts based on language
function updateTimelineTexts(language) {
    aboutText[0] = translations[language]['about-timeline1'];
    aboutText[1] = translations[language]['about-timeline2'];
    aboutText[2] = translations[language]['about-timeline3'];
    // Reset animation
    lineIndex = 0;
    typeAbout();
}

// Update all translatable elements on the page
function updatePageLanguage(language) {
    // Navigation links translation
    document.querySelector('.nav-links li:nth-child(1) a').textContent = translations[language]['nav-home'];
    document.querySelector('.nav-links li:nth-child(2) a').textContent = translations[language]['nav-about'];
    document.querySelector('.nav-links li:nth-child(3) a').textContent = translations[language]['nav-skills'];
    document.querySelector('.nav-links li:nth-child(4) a').textContent = translations[language]['nav-projects'];
    document.querySelector('.nav-links li:nth-child(5) a').textContent = translations[language]['nav-experience'];
    document.querySelector('.nav-links li:nth-child(6) a').textContent = translations[language]['nav-education'];
    document.querySelector('.nav-links li:nth-child(7) a').textContent = translations[language]['nav-contact'];
    
    // Hero Section
    document.querySelector('.typewriter').textContent = translations[language]['hero-title'];
    document.querySelector('.hero-content p').textContent = translations[language]['hero-tagline'];
    document.querySelector('.hero-content .btn').textContent = translations[language]['hero-cta'];
    
    // About Section
    document.querySelector('#about h2').textContent = translations[language]['about-title'];
    document.querySelector('.about-container > p').textContent = translations[language]['about-text'];
    updateTimelineTexts(language);
    
    // Skills Section
    document.querySelector('#skills h2').textContent = translations[language]['skills-title'];
    document.querySelector('.code-stats h3').textContent = translations[language]['skills-code-pulse'];
    document.querySelector('.code-stats p').innerHTML = 
        `${translations[language]['skills-loc']}: <span id="loc">${loc.textContent}</span> | ${translations[language]['skills-commits']}: <span id="commits">${commits.textContent}</span>`;
    
    // Update skill category titles
    document.querySelectorAll('.skills-category h3').forEach((el, index) => {
        switch(index) {
            case 0: el.textContent = translations[language]['skills-prog-lang']; break;
            case 1: el.textContent = translations[language]['skills-frontend']; break;
            case 2: el.textContent = translations[language]['skills-backend']; break;
            case 3: el.textContent = translations[language]['skills-databases']; break;
            case 4: el.textContent = translations[language]['skills-tools']; break;
            case 5: el.textContent = translations[language]['skills-languages']; break;
            case 6: el.textContent = translations[language]['skills-qualities']; break;
        }
    });
    
    // Experience Section
    document.querySelector('#experience h2').textContent = translations[language]['experience-title'];
    const expItems = document.querySelectorAll('#experience .timeline-item');
    
    // SFVE
    expItems[0].querySelector('h3').textContent = translations[language]['experience-sfve-title'];
    expItems[0].querySelector('p:first-of-type').textContent = translations[language]['experience-sfve-position'];
    expItems[0].querySelector('p:last-of-type').textContent = translations[language]['experience-sfve-desc'];
    
    // SRTIMCom
    expItems[1].querySelector('h3').textContent = translations[language]['experience-srtim-title'];
    expItems[1].querySelector('p:first-of-type').textContent = translations[language]['experience-srtim-position'];
    expItems[1].querySelector('p:last-of-type').textContent = translations[language]['experience-srtim-desc'];
    
    // Wilaya
    expItems[2].querySelector('h3').textContent = translations[language]['experience-wilaya-title'];
    expItems[2].querySelector('p:first-of-type').textContent = translations[language]['experience-wilaya-position'];
    expItems[2].querySelector('p:last-of-type').textContent = translations[language]['experience-wilaya-desc'];
    
    // Education Section
    document.querySelector('#education h2').textContent = translations[language]['education-title'];
    const eduItems = document.querySelectorAll('#education .timeline-item');
    
    // Epitech
    eduItems[0].querySelector('h3').textContent = translations[language]['education-epitech-title'];
    eduItems[0].querySelector('p:first-of-type').textContent = translations[language]['education-epitech-spec'];
    eduItems[0].querySelector('p:last-of-type').textContent = translations[language]['education-epitech-level'];
    
    // ENSA
    eduItems[1].querySelector('h3').textContent = translations[language]['education-ensa-title'];
    eduItems[1].querySelector('p').textContent = translations[language]['education-ensa-spec'];
    
    // BTS
    eduItems[2].querySelector('h3').textContent = translations[language]['education-bts-title'];
    eduItems[2].querySelector('p').textContent = translations[language]['education-bts-spec'];
    
    // Projects Section
    document.querySelector('#projects h2').textContent = translations[language]['projects-title'];
    const projectCards = document.querySelectorAll('.project-card');
    
    // Update project titles
    projectCards[0].querySelector('.card-front h3').textContent = translations[language]['project-trelltech-title'];
    projectCards[1].querySelector('.card-front h3').textContent = translations[language]['project-marvin-title'];
    projectCards[2].querySelector('.card-front h3').textContent = translations[language]['project-tweet-title'];
    
    // Update project descriptions
    projectCards[0].querySelector('.card-back p:first-child').textContent = translations[language]['project-trelltech-desc'];
    projectCards[0].querySelector('.card-back p:nth-child(2)').textContent = translations[language]['project-trelltech-tech'];
    projectCards[0].querySelector('.card-back .btn-small').textContent = translations[language]['project-view'];
    
    projectCards[1].querySelector('.card-back p:first-child').textContent = translations[language]['project-marvin-desc'];
    projectCards[1].querySelector('.card-back p:nth-child(2)').textContent = translations[language]['project-marvin-tech'];
    projectCards[1].querySelector('.card-back .btn-small').textContent = translations[language]['project-view'];
    
    projectCards[2].querySelector('.card-back p:first-child').textContent = translations[language]['project-tweet-desc'];
    projectCards[2].querySelector('.card-back p:nth-child(2)').textContent = translations[language]['project-tweet-tech'];
    projectCards[2].querySelector('.card-back .btn-small').textContent = translations[language]['project-view'];
    
    // Contact Section
    document.querySelector('#contact h2').textContent = translations[language]['contact-title'];
    document.querySelector('.contact-grid p:last-child').textContent = translations[language]['contact-location'];
}

// Initial language from localStorage or default to English
if (localStorage.getItem('language') === 'fr') {
    body.classList.add('french-mode');
    updatePageLanguage('fr');
} else {
    updatePageLanguage('en');
}

// Make sure all translations are applied on page load
document.addEventListener('DOMContentLoaded', function() {
    const language = body.classList.contains('french-mode') ? 'fr' : 'en';
    updatePageLanguage(language);
});

// Language toggle event
langToggle.addEventListener('click', () => {
    body.classList.toggle('french-mode');
    const language = body.classList.contains('french-mode') ? 'fr' : 'en';
    localStorage.setItem('language', language);
    updatePageLanguage(language);
    
    // Update chart labels if language changes
    if (skillsChart) {
        if (language === 'fr') {
            skillsChart.data.labels = ['Front-End', 'Back-End', 'Bases de Données', 'Outils', 'Soft Skills'];
        } else {
            skillsChart.data.labels = ['Front-End', 'Back-End', 'Databases', 'Tools', 'Soft Skills'];
        }
        skillsChart.update();
    }
});

// Console Easter Egg
console.log('%cYo, dev! Want to hack the future with me?', 'color: #00ffcc; font-size: 20px; text-shadow: 0 0 5px #ff007a;');

// Make sure the skills pill text content is updated properly
document.addEventListener('DOMContentLoaded', function() {
    // Create a mapping of English to French translations for skill pills
    const skillPillTranslations = {
        'Motivation': 'Motivation',
        'Autonomy': 'Autonomie',
        'Proactivity': 'Proactivité',
        'Creativity': 'Créativité'
    };
    
    // Apply translations based on current language
    function updateSkillPills() {
        if (body.classList.contains('french-mode')) {
            document.querySelectorAll('.skill-pills .skill-pill').forEach(pill => {
                const englishText = pill.getAttribute('data-en') || pill.textContent;
                pill.setAttribute('data-en', englishText); // Store English version
                if (skillPillTranslations[englishText]) {
                    pill.textContent = skillPillTranslations[englishText];
                }
            });
        } else {
            document.querySelectorAll('.skill-pills .skill-pill').forEach(pill => {
                const englishText = pill.getAttribute('data-en');
                if (englishText) {
                    pill.textContent = englishText;
                }
            });
        }
    }
    
    // Store original English text on page load
    document.querySelectorAll('.skill-pills .skill-pill').forEach(pill => {
        pill.setAttribute('data-en', pill.textContent);
    });
    
    // Update on language toggle
    langToggle.addEventListener('click', updateSkillPills);
    
    // Initial update if page loads in French
    if (body.classList.contains('french-mode')) {
        updateSkillPills();
    }
});

// Handle contact form submission
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            const recipient = document.querySelector('input[name="recipient"]').value;
            
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Prepare template parameters for EmailJS
            const templateParams = {
                name: name,
                email: email,
                message: message,
                time: new Date().toLocaleString(), // Add current timestamp
                to_email: recipient
            };
            
            // Send email using EmailJS
            // Template ID should match your template in the EmailJS dashboard
            emailjs.send('service_qoqcasn', 'template_7jvk5ha', templateParams)
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    
                    // Show success message
                    formStatus.innerHTML = `
                        <div class="form-success">
                            <h3>Message Sent!</h3>
                            <p>Thanks ${name}, I'll get back to you soon!</p>
                        </div>
                    `;
                    formStatus.style.display = 'block';
                    contactForm.reset();
                    
                    // Hide the form
                    contactForm.style.display = 'none';
                })
                .catch(function(error) {
                    console.log('FAILED...', error);
                    
                    // Show error message
                    formStatus.innerHTML = `
                        <div class="form-error">
                            <h3>Message Failed</h3>
                            <p>Sorry, there was an error sending your message. Please try again or email me directly.</p>
                        </div>
                    `;
                    formStatus.style.display = 'block';
                })
                .finally(function() {
                    // Reset button state
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                });
        });
    }
    
    // Add animated entry for skill pills
    const skillPills = document.querySelectorAll('.skill-pill');
    const pillObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add a staggered delay based on index
                setTimeout(() => {
                    entry.target.classList.add('skill-pill-animate');
                }, index * 50);
            }
        });
    }, { threshold: 0.1 });
    
    skillPills.forEach(pill => {
        pillObserver.observe(pill);
        // Set initial state
        pill.style.opacity = '0';
        pill.style.transform = 'translateY(20px)';
    });
});

// Add scroll progress indicator
window.addEventListener('DOMContentLoaded', () => {
    // Create progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
    
    // Update progress bar on scroll
    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercentage = (scrollTop / scrollHeight) * 100;
        
        progressBar.style.width = scrollPercentage + '%';
    });
});

// Console Easter Egg
console.log('%cYo, dev! Want to hack the future with me?', 'color: #00ffcc; font-size: 20px; text-shadow: 0 0 5px #ff007a;');