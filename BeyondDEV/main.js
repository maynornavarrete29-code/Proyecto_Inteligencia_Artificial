/* ==========================================================================
   BeyondDev Landing Page - Interactive Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Header Scroll Effect ---
    const header = document.getElementById('main-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- 2. Mobile Drawer Menu ---
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const drawerClose = document.querySelector('.drawer-close');
    const drawer = document.querySelector('.mobile-drawer');
    const drawerLinks = document.querySelectorAll('.drawer-link');

    const toggleDrawer = () => {
        drawer.classList.toggle('open');
        document.body.style.overflow = drawer.classList.contains('open') ? 'hidden' : '';
    };

    menuToggle.addEventListener('click', toggleDrawer);
    drawerClose.addEventListener('click', toggleDrawer);

    drawerLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (drawer.classList.contains('open')) {
                toggleDrawer();
            }
        });
    });

    // --- 3. Dynamic Tech Hover Glowing Background ---
    // Add magnetic or interactive glowing light follow effects on cards (optional extra visual detail)
    const glassCards = document.querySelectorAll('.glass-card');
    glassCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element.
            const y = e.clientY - rect.top;  // y position within the element.
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // --- 4. Portfolio Filters ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const portfolioGrid = document.querySelector('.portfolio-grid');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            // Apply fade-out animation to the grid
            portfolioGrid.style.opacity = '0';

            setTimeout(() => {
                projectCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    if (filterValue === 'all' || category === filterValue) {
                        card.classList.remove('hide');
                    } else {
                        card.classList.add('hide');
                    }
                });
                
                // Fade back in
                portfolioGrid.style.opacity = '1';
            }, 300);
        });
    });

    // --- 5. Intersection Observer: Active Link Highlighting ---
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    const drawerNavLinks = document.querySelectorAll('.drawer-link');

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px', // Trigger when section occupies the middle part of the screen
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                
                // Update Desktop nav
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });

                // Update Mobile drawer nav
                drawerNavLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));

    // --- 6. Scroll Reveal Animation Setup ---
    // Dynamically add reveal classes to sections and cards for cleaner HTML
    const revealSelectors = [
        '.section-header', 
        '.about-info-card', 
        '.perk-card', 
        '.service-card', 
        '.tech-item', 
        '.project-card',
        '.contact-info-panel',
        '.contact-form-panel'
    ];

    revealSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach((el, index) => {
            el.classList.add('reveal');
            
            // Add stagger delays based on index/order
            if (selector === '.perk-card' || selector === '.service-card' || selector === '.tech-item' || selector === '.project-card') {
                const delay = (index % 4) * 100; // stagger 100ms, 200ms, 300ms, etc.
                if (delay > 0) {
                    el.classList.add(`delay-${delay}`);
                }
            }
        });
    });

    // Observe reveal elements
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Unobserve once revealed to keep animations clean
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- 7. Stat Counters Animation ---
    const statsSection = document.querySelector('.about-stats-grid');
    const statNums = document.querySelectorAll('.stat-num');
    let countersStarted = false;

    const startCounters = () => {
        statNums.forEach(num => {
            const target = parseInt(num.getAttribute('data-val'));
            let current = 0;
            const duration = 2000; // 2 seconds
            const steps = 50;
            const increment = target / steps;
            const stepTime = duration / steps;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    num.textContent = target;
                    clearInterval(timer);
                } else {
                    num.textContent = Math.floor(current);
                }
            }, stepTime);
        });
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersStarted) {
                countersStarted = true;
                startCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // --- 8. Contact Form Validation & Submission ---
    const form = document.getElementById('project-registration-form');
    const submitBtn = form.querySelector('.btn-submit');
    const successModal = document.getElementById('success-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');

    // Email regex helper
    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    // Helper to validate a group
    const validateGroup = (group, condition) => {
        if (condition) {
            group.classList.remove('invalid');
            return true;
        } else {
            group.classList.add('invalid');
            return false;
        }
    };

    // Live validation
    const inputsToValidate = form.querySelectorAll('input[required], select[required], textarea[required]');
    inputsToValidate.forEach(input => {
        const group = input.closest('.form-group');
        
        input.addEventListener('input', () => {
            if (input.type === 'email') {
                validateGroup(group, isValidEmail(input.value.trim()));
            } else {
                validateGroup(group, input.value.trim() !== '');
            }
        });

        if (input.tagName === 'SELECT') {
            input.addEventListener('change', () => {
                validateGroup(group, input.value !== '');
            });
        }
    });

    // Handle form submit
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isFormValid = true;

        // Final validation check for all fields
        inputsToValidate.forEach(input => {
            const group = input.closest('.form-group');
            let fieldValid = false;

            if (input.type === 'email') {
                fieldValid = isValidEmail(input.value.trim());
            } else if (input.tagName === 'SELECT') {
                fieldValid = input.value !== '';
            } else {
                fieldValid = input.value.trim() !== '';
            }

            if (!validateGroup(group, fieldValid)) {
                isFormValid = false;
            }
        });

        if (isFormValid) {
            // Show loading state
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;

            // Simulate server response timeout
            setTimeout(() => {
                // Reset form & states
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                
                // Show custom modal
                successModal.classList.add('open');
                
                form.reset();
                
                // Reset all invalid error classes
                form.querySelectorAll('.form-group').forEach(group => {
                    group.classList.remove('invalid');
                });
            }, 1800);
        } else {
            // Scroll to the first invalid field
            const firstInvalid = form.querySelector('.form-group.invalid');
            if (firstInvalid) {
                firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });

    // Close Modal trigger
    closeModalBtn.addEventListener('click', () => {
        successModal.classList.remove('open');
    });

    successModal.addEventListener('click', (e) => {
        if (e.target === successModal) {
            successModal.classList.remove('open');
        }
    });
});
