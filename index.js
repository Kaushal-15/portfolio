// Dark mode toggle
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const html = document.documentElement;

// Check for saved theme preference or use system preference
const savedTheme = localStorage.getItem('theme') || 
                   (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

if (savedTheme === 'dark') {
    html.classList.add('dark');
    themeIcon.classList.replace('fa-moon', 'fa-sun');
}

// System preference change listener
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('theme')) {
        if (e.matches) {
            html.classList.add('dark');
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        } else {
            html.classList.remove('dark');
            themeIcon.classList.replace('fa-sun', 'fa-moon');
        }
    }
});

themeToggle.addEventListener('click', () => {
    html.classList.toggle('dark');
    
    if (html.classList.contains('dark')) {
        themeIcon.classList.replace('fa-moon', 'fa-sun');
        localStorage.setItem('theme', 'dark');
    } else {
        themeIcon.classList.replace('fa-sun', 'fa-moon');
        localStorage.setItem('theme', 'light');
    }
});

// Mobile menu toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    
    // Change icon based on menu state
    const icon = mobileMenuButton.querySelector('i');
    if (mobileMenu.classList.contains('open')) {
        icon.classList.replace('fa-bars', 'fa-times');
    } else {
        icon.classList.replace('fa-times', 'fa-bars');
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        // Close mobile menu if open
        if (mobileMenu.classList.contains('open')) {
            mobileMenu.classList.remove('open');
            mobileMenuButton.querySelector('i').classList.replace('fa-times', 'fa-bars');
        }
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Form submission
const contactForm = document.querySelector('form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for your message! I will get back to you soon.');
        contactForm.reset();
    });
}
