/**
 * GSAP Animations
 * Advanced scroll-triggered and interactive animations
 */

// Initialize GSAP and ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

class PortfolioAnimations {
    constructor() {
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupAnimations());
        } else {
            this.setupAnimations();
        }
    }

    setupAnimations() {
        this.heroAnimations();
        this.scrollAnimations();
        this.skillBadgeAnimations();
        this.projectCardAnimations();
        this.magneticButtons();
        this.textRevealAnimations();
    }

    heroAnimations() {
        // Hero section entrance animation
        const tl = gsap.timeline({ delay: 0.5 });

        tl.from('.gsoc-badge', {
            y: -50,
            opacity: 0,
            duration: 0.8,
            ease: 'back.out(1.7)'
        })
            .from('h1 span', {
                y: 100,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: 'power4.out'
            }, '-=0.4')
            .from('h2', {
                y: 50,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out'
            }, '-=0.6')
            .from('.hero-description', {
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out'
            }, '-=0.4')
            .from('.btn-primary, .btn-outline', {
                y: 30,
                opacity: 0,
                duration: 0.6,
                stagger: 0.2,
                ease: 'power3.out'
            }, '-=0.4')
            .from('.profile-container', {
                scale: 0,
                rotation: 180,
                opacity: 0,
                duration: 1.2,
                ease: 'elastic.out(1, 0.5)'
            }, '-=1.2');
    }

    scrollAnimations() {
        // Animate sections on scroll
        gsap.utils.toArray('section').forEach((section, index) => {
            // Skip hero section
            if (index === 0) return;

            gsap.from(section, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                    end: 'top 20%',
                    toggleActions: 'play none none reverse'
                },
                y: 100,
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            });
        });

        // Section headers
        gsap.utils.toArray('section h2').forEach(header => {
            gsap.from(header, {
                scrollTrigger: {
                    trigger: header,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                scale: 0.5,
                opacity: 0,
                duration: 0.8,
                ease: 'back.out(1.7)'
            });
        });
    }

    skillBadgeAnimations() {
        // Animate skill badges with stagger
        gsap.utils.toArray('.skill-badge').forEach((badge, index) => {
            gsap.from(badge, {
                scrollTrigger: {
                    trigger: badge,
                    start: 'top 90%',
                    toggleActions: 'play none none reverse'
                },
                scale: 0,
                rotation: 360,
                opacity: 0,
                duration: 0.6,
                delay: (index % 6) * 0.1,
                ease: 'back.out(1.7)'
            });

            // Hover animation
            badge.addEventListener('mouseenter', () => {
                gsap.to(badge, {
                    scale: 1.1,
                    rotation: 5,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });

            badge.addEventListener('mouseleave', () => {
                gsap.to(badge, {
                    scale: 1,
                    rotation: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        });
    }

    projectCardAnimations() {
        // Animate project cards
        gsap.utils.toArray('.project-card').forEach((card, index) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                x: index % 2 === 0 ? -100 : 100,
                opacity: 0,
                rotation: index % 2 === 0 ? -5 : 5,
                duration: 1,
                ease: 'power3.out'
            });

            // 3D tilt effect on hover
            card.addEventListener('mouseenter', (e) => {
                gsap.to(card, {
                    rotationY: 5,
                    rotationX: -5,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    rotationY: 0,
                    rotationX: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });

            // Mouse move parallax
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;

                gsap.to(card, {
                    rotationX: rotateX,
                    rotationY: rotateY,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        });
    }

    magneticButtons() {
        // Magnetic effect for buttons
        const buttons = document.querySelectorAll('.btn-primary, .btn-outline');

        buttons.forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                gsap.to(button, {
                    x: x * 0.3,
                    y: y * 0.3,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });

            button.addEventListener('mouseleave', () => {
                gsap.to(button, {
                    x: 0,
                    y: 0,
                    duration: 0.5,
                    ease: 'elastic.out(1, 0.5)'
                });
            });
        });
    }

    textRevealAnimations() {
        // Split text animation for paragraphs
        gsap.utils.toArray('.glass-card p').forEach(paragraph => {
            gsap.from(paragraph, {
                scrollTrigger: {
                    trigger: paragraph,
                    start: 'top 90%',
                    toggleActions: 'play none none reverse'
                },
                opacity: 0,
                y: 20,
                duration: 0.8,
                ease: 'power3.out'
            });
        });
    }
}

// Parallax scrolling effect
function initParallax() {
    gsap.utils.toArray('.floating-element').forEach((element, index) => {
        const speed = 0.5 + (index * 0.2);

        gsap.to(element, {
            scrollTrigger: {
                trigger: 'body',
                start: 'top top',
                end: 'bottom bottom',
                scrub: true
            },
            y: (i, target) => -ScrollTrigger.maxScroll(window) * speed,
            ease: 'none'
        });
    });
}

// Smooth scroll
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                gsap.to(window, {
                    duration: 1,
                    scrollTo: {
                        y: target,
                        offsetY: 80
                    },
                    ease: 'power3.inOut'
                });
            }
        });
    });
}

// Initialize all animations
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioAnimations();
    initParallax();
    initSmoothScroll();
});
