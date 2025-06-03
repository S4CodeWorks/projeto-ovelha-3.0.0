document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.header');
    const menuToggle = document.querySelector('.menu-toggle');
    const navOverlay = document.querySelector('.nav-overlay');
    const navClose = document.querySelector('.nav-close');
    const navContent = document.querySelector('.nav-overlay .nav-content');
    const mainContent = document.querySelector('main'); 

    function setMainMargin() {
        if (header && mainContent) {
            const headerHeight = header.offsetHeight;
            mainContent.style.marginTop = `${headerHeight}px`;
        }
    }
    
    setMainMargin();
    window.addEventListener('resize', setMainMargin);

    function handleScroll() {
        if (window.scrollY > 30) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    function toggleMenu() {
        const isActive = navOverlay.classList.contains('active');
        if (isActive) {
            navOverlay.classList.remove('active');
            setTimeout(() => {
                 if (!navOverlay.classList.contains('active')) { 
                    document.body.style.overflow = '';
                 }
            }, 500); 
        } else {
            navOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    menuToggle.addEventListener('click', toggleMenu);
    navClose.addEventListener('click', toggleMenu);

    document.querySelectorAll('.nav-overlay a').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href;
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    toggleMenu(); 
                    
                    setTimeout(() => {
                        // Ensure header height is correctly determined even if not scrolled
                        const currentHeader = document.querySelector('.header');
                        const headerCurrentHeight = currentHeader.offsetHeight;
                        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerCurrentHeight;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }, 300); 
                }
            } else {
                if (navOverlay.classList.contains('active')) {
                    toggleMenu();
                }
            }
        });
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navOverlay.classList.contains('active')) {
            toggleMenu();
        }
    });

    navOverlay.addEventListener('click', function(e) {
        if (e.target === navOverlay) { 
            toggleMenu();
        }
    });
    
    if (navContent) {
        navContent.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }

    // Scroll Animations
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    const observerOptions = {
        root: null, 
        rootMargin: '0px',
        threshold: 0.1 
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Stagger animations for children of a common parent if needed
                if (entry.target.parentElement.classList.contains('hero-cards') || 
                    entry.target.parentElement.classList.contains('breeds-grid') ||
                    entry.target.parentElement.classList.contains('features')) {
                    const children = Array.from(entry.target.parentElement.children);
                    const index = children.indexOf(entry.target);
                    entry.target.style.transitionDelay = `${index * 0.1}s`;
                }
                observer.unobserve(entry.target); 
            }
        });
    };

    const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);

    animatedElements.forEach(el => {
        scrollObserver.observe(el);
    });
});