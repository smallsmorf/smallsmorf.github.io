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
        // Initialize all project sliders
        const sliders = document.querySelectorAll('.project-image-slider');
        
        sliders.forEach(slider => {
            const images = slider.querySelectorAll('.slider-image');
            const dots = slider.querySelectorAll('.slider-dot');
            const prevBtn = slider.querySelector('.slider-prev');
            const nextBtn = slider.querySelector('.slider-next');
            const progressBar = slider.querySelector('.slider-progress');
            
            let currentIndex = 0;
            let slideInterval;
            
            // Function to show specific slide
            function showSlide(index) {
                // Remove active class from all images and dots
                images.forEach(img => img.classList.remove('active'));
                dots.forEach(dot => dot.classList.remove('active'));
                
                // Add active class to current image and dot
                images[index].classList.add('active');
                if (dots[index]) {
                    dots[index].classList.add('active');
                }
                
                // Update progress bar
                if (progressBar) {
                    progressBar.style.width = '0%';
                    
                    // Use requestAnimationFrame for smoother animation
                    requestAnimationFrame(() => {
                        progressBar.style.transition = `width 5000ms linear`; // Match to slideInterval time
                        progressBar.style.width = '100%';
                    });
                }
                
                currentIndex = index;
            }
            
            // Make sure we have buttons before adding event listeners
            if (prevBtn) {
                // Event for previous button
                prevBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    let index = currentIndex - 1;
                    if (index < 0) index = images.length - 1;
                    showSlide(index);
                    
                    // Reset the interval when manually changing slides
                    resetInterval();
                });
            }
            
            if (nextBtn) {
                // Event for next button
                nextBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    let index = currentIndex + 1;
                    if (index >= images.length) index = 0;
                    showSlide(index);
                    
                    // Reset the interval when manually changing slides
                    resetInterval();
                });
            }
            
            // Event for dots
            dots.forEach(dot => {
                dot.addEventListener('click', function(e) {
                    e.preventDefault();
                    const index = parseInt(dot.getAttribute('data-index'));
                    showSlide(index);
                    
                    // Reset the interval when manually changing slides
                    resetInterval();
                });
            });
            
            // Add swipe functionality for mobile
            let touchStartX = 0;
            let touchEndX = 0;
    
            slider.addEventListener('touchstart', e => {
                touchStartX = e.changedTouches[0].screenX;
                
                // Pause auto-slide on touch
                stopInterval();
            });
    
            slider.addEventListener('touchend', e => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
                
                // Resume auto-slide after touch
                startInterval();
            });
    
            function handleSwipe() {
                const threshold = 50; // Minimum swipe distance
                
                if (touchEndX < touchStartX - threshold) {
                    // Swipe left - go to next slide
                    let index = currentIndex + 1;
                    if (index >= images.length) index = 0;
                    showSlide(index);
                }
                
                if (touchEndX > touchStartX + threshold) {
                    // Swipe right - go to previous slide
                    let index = currentIndex - 1;
                    if (index < 0) index = images.length - 1;
                    showSlide(index);
                }
            }
            
            // Auto slide functions
            function startInterval() {
                // Clear any existing interval first
                stopInterval();
                
                // Start a new interval
                slideInterval = setInterval(() => {
                    let index = currentIndex + 1;
                    if (index >= images.length) index = 0;
                    showSlide(index);
                }, 5000); // Change slide every 5 seconds
            }
            
            function stopInterval() {
                if (slideInterval) {
                    clearInterval(slideInterval);
                    
                    // Also pause the progress animation if we have a progress bar
                    if (progressBar) {
                        const computedStyle = window.getComputedStyle(progressBar);
                        const width = computedStyle.getPropertyValue('width');
                        
                        progressBar.style.transition = 'none';
                        progressBar.style.width = width;
                    }
                }
            }
            
            function resetInterval() {
                stopInterval();
                startInterval();
            }
            
            // Start auto-sliding
            startInterval();
            
            // Pause auto-slide on hover
            slider.addEventListener('mouseenter', stopInterval);
            slider.addEventListener('mouseleave', startInterval);
            
            // Initialize the first slide
            showSlide(0);
            
            // Log to console to verify slider is initialized
            console.log('Slider initialized with', images.length, 'images');
        });
});