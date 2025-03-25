// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get the back to top button
    const backToTopButton = document.getElementById('backToTop');
    
    // Function to toggle button visibility based on scroll position
    function toggleBackToTopButton() {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    }
    
    // Add scroll event listener
    window.addEventListener('scroll', toggleBackToTopButton);
    
    // Add click event listener for smooth scrolling
    backToTopButton.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Initialize button state on page load
    toggleBackToTopButton();

    // Mobile menu toggle functionality
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    menuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });

    // 1. LOADING STATE
    // Create loading overlay
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = '<div class="loading-spinner"></div>';
    document.body.prepend(loadingOverlay);

    // Hide loading overlay when the page is fully loaded
    window.addEventListener('load', function() {
        setTimeout(() => {
            loadingOverlay.classList.add('hidden');
        }, 500); // Short delay for visual effect
    });

    // 2. SCROLL ANIMATIONS
    // Function to handle fade-in animations
    const fadeElements = document.querySelectorAll('.featured-work-header, .project, .about-content, .case-study-section');
    fadeElements.forEach(element => {
        element.classList.add('fade-element');
    });

    // Use Intersection Observer for scroll animations
    const fadeOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -100px 0px"
    };

    const handleFadeOnScroll = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                entry.target.classList.remove('fade-out');
            } else {
                entry.target.classList.remove('fade-in');
                entry.target.classList.add('fade-out');
            }
        });
    }, fadeOptions);

    fadeElements.forEach(element => {
        handleFadeOnScroll.observe(element);
    });

    // 3. NAVIGATION ENHANCEMENTS
    // Change header appearance on scroll
    const header = document.querySelector('header');
    const headerScrollThreshold = 100;

    function toggleHeaderClass() {
        if (window.scrollY > headerScrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', toggleHeaderClass);
    toggleHeaderClass(); // Initial check

    // Highlight active navigation section
    const sections = document.querySelectorAll('section[id]');
    const navLinkItems = document.querySelectorAll('.nav-links a[href^="#"]');

    function highlightActiveSection() {
        const scrollPosition = window.scrollY + 150; // Offset for better UX

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinkItems.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightActiveSection);
    highlightActiveSection(); // Initial check

    // Smooth scroll for all in-page navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
                
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 80, // Offset for fixed header
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // 4. PERFORMANCE OPTIMIZATIONS
    // Lazy loading images
    const lazyImages = document.querySelectorAll('img');

    lazyImages.forEach(img => {
        // Skip placeholder images
        if (!img.src.includes('/api/placeholder/')) {
            // Store original src
            const originalSrc = img.src;
            
            // Create a placeholder or use existing
            img.src = '/api/placeholder/10/10'; // Tiny placeholder
            img.classList.add('lazy-image');
            
            // Set up IntersectionObserver to load the image when it comes into view
            const lazyImageObserver = new IntersectionObserver(function(entries, observer) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const lazyImage = entry.target;
                        lazyImage.src = originalSrc;
                        lazyImage.addEventListener('load', function() {
                            lazyImage.classList.add('loaded');
                        });
                        observer.unobserve(lazyImage);
                    }
                });
            });
            
            lazyImageObserver.observe(img);
        }
    });
});