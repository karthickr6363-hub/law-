/* ============================================
   LAW FIRM WEBSITE - MAIN JAVASCRIPT
   All Interactive Components
   ============================================ */

(function() {
    'use strict';

    // ============================================
    // NAVBAR STICKY & MOBILE MENU
    // ============================================
    
    const navbar = document.querySelector('.navbar');
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    // Sticky navbar on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
            navbar.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        } else {
            navbar.classList.remove('scrolled');
            navbar.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        }
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navbar.contains(event.target);
        if (!isClickInsideNav && navbarCollapse.classList.contains('show')) {
            navbarToggler.click();
        }
    });
    
    // Close mobile menu when clicking on a link (but not dropdown toggles)
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link:not(.dropdown-toggle)');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Don't close if it's a dropdown toggle or if clicking inside dropdown
            if (window.innerWidth < 992 && !this.classList.contains('dropdown-toggle') && !this.closest('.dropdown-menu')) {
                navbarToggler.click();
            }
        });
    });
    
    // Handle dropdown menu clicks on mobile
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
        item.addEventListener('click', function() {
            // Close mobile menu after selecting dropdown item
            if (window.innerWidth < 992 && navbarCollapse.classList.contains('show')) {
                setTimeout(() => {
                    navbarToggler.click();
                }, 100);
            }
        });
    });
    
    // Prevent dropdown from closing navbar on mobile
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            // On mobile, prevent the navbar from closing when opening dropdown
            if (window.innerWidth < 992) {
                e.stopPropagation();
            }
        });
    });

    // ============================================
    // TESTIMONIAL SLIDER
    // ============================================
    
    const testimonialSlider = document.querySelector('.testimonial-slider');
    if (testimonialSlider) {
        let currentSlide = 0;
        const slides = testimonialSlider.querySelectorAll('.testimonial-slide');
        const totalSlides = slides.length;
        
        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.style.display = i === index ? 'block' : 'none';
            });
        }
        
        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            showSlide(currentSlide);
        }
        
        function prevSlide() {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            showSlide(currentSlide);
        }
        
        // Auto-rotate testimonials
        if (totalSlides > 1) {
            setInterval(nextSlide, 5000);
            showSlide(0);
        }
        
        // Manual navigation
        const prevBtn = testimonialSlider.querySelector('.prev-btn');
        const nextBtn = testimonialSlider.querySelector('.next-btn');
        
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    }

    // ============================================
    // ACCORDION / FAQ
    // ============================================
    
    const accordionHeaders = document.querySelectorAll('.accordion-header button');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const isActive = this.classList.contains('active');
            const content = this.nextElementSibling;
            
            // Close all other accordions
            accordionHeaders.forEach(otherHeader => {
                if (otherHeader !== this) {
                    otherHeader.classList.remove('active');
                    otherHeader.nextElementSibling.classList.remove('active');
                }
            });
            
            // Toggle current accordion
            if (isActive) {
                this.classList.remove('active');
                content.classList.remove('active');
            } else {
                this.classList.add('active');
                content.classList.add('active');
            }
        });
    });

    // ============================================
    // FORM VALIDATION
    // ============================================
    
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
            
            inputs.forEach(input => {
                if (!validateInput(input)) {
                    isValid = false;
                }
            });
            
            if (isValid) {
                // Show success message
                const successMsg = form.querySelector('.success-message');
                if (successMsg) {
                    successMsg.classList.add('show');
                }
                
                // Reset form after 2 seconds
                setTimeout(() => {
                    form.reset();
                    if (successMsg) {
                        successMsg.classList.remove('show');
                    }
                }, 3000);
            }
        });
        
        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateInput(this);
            });
        });
    });
    
    function validateInput(input) {
        const value = input.value.trim();
        const type = input.type;
        const errorMsg = input.parentElement.querySelector('.error-message') || 
                        input.nextElementSibling;
        
        // Remove previous error
        if (errorMsg && errorMsg.classList.contains('error-message')) {
            errorMsg.classList.remove('show');
            input.classList.remove('is-invalid');
        }
        
        // Required field check
        if (input.hasAttribute('required') && !value) {
            showError(input, 'This field is required');
            return false;
        }
        
        // Email validation
        if (type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showError(input, 'Please enter a valid email address');
                return false;
            }
        }
        
        // Phone validation
        if (type === 'tel' && value) {
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            if (!phoneRegex.test(value) || value.replace(/\D/g, '').length < 10) {
                showError(input, 'Please enter a valid phone number');
                return false;
            }
        }
        
        // Name validation (letters and spaces only)
        if (input.name === 'name' && value) {
            const nameRegex = /^[a-zA-Z\s]+$/;
            if (!nameRegex.test(value) || value.length < 2) {
                showError(input, 'Please enter a valid name (at least 2 characters)');
                return false;
            }
        }
        
        // Valid input
        input.classList.add('is-valid');
        return true;
    }
    
    function showError(input, message) {
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
        
        let errorMsg = input.parentElement.querySelector('.error-message');
        if (!errorMsg) {
            errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            input.parentElement.appendChild(errorMsg);
        }
        errorMsg.textContent = message;
        errorMsg.classList.add('show');
    }

    // ============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ============================================
    // IMAGE LAZY LOADING
    // ============================================
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ============================================
    // ANIMATE ON SCROLL
    // ============================================
    
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.fade-in-on-scroll');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        
        elements.forEach(element => {
            observer.observe(element);
        });
    };
    
    animateOnScroll();

    // ============================================
    // COUNTER ANIMATION
    // ============================================
    
    const counters = document.querySelectorAll('.counter');
    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current) + '+';
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + '+';
            }
        };
        
        updateCounter();
    };
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

    // ============================================
    // TABLE OF CONTENTS GENERATOR (Blog Details)
    // ============================================
    
    const generateTOC = () => {
        const articleContent = document.querySelector('.article-content');
        const tocContainer = document.querySelector('.table-of-contents');
        
        if (articleContent && tocContainer) {
            const headings = articleContent.querySelectorAll('h2, h3');
            if (headings.length > 0) {
                let tocHTML = '<ul>';
                headings.forEach((heading, index) => {
                    const id = `heading-${index}`;
                    heading.id = id;
                    const level = heading.tagName === 'H2' ? '' : '&nbsp;&nbsp;&nbsp;&nbsp;';
                    tocHTML += `<li>${level}<a href="#${id}">${heading.textContent}</a></li>`;
                });
                tocHTML += '</ul>';
                tocContainer.innerHTML = tocHTML;
            }
        }
    };
    
    generateTOC();

    // ============================================
    // BLOG SEARCH & FILTER
    // ============================================
    
    const blogSearch = document.querySelector('#blog-search');
    const blogFilters = document.querySelectorAll('.blog-filter');
    
    if (blogSearch) {
        blogSearch.addEventListener('input', filterBlogs);
    }
    
    blogFilters.forEach(filter => {
        filter.addEventListener('click', function(e) {
            e.preventDefault();
            blogFilters.forEach(f => f.classList.remove('active'));
            this.classList.add('active');
            filterBlogs();
        });
    });
    
    function filterBlogs() {
        const searchTerm = blogSearch ? blogSearch.value.toLowerCase() : '';
        const activeFilter = document.querySelector('.blog-filter.active');
        const category = activeFilter ? activeFilter.dataset.category : 'all';
        const blogCards = document.querySelectorAll('.blog-card');
        
        blogCards.forEach(card => {
            const title = card.querySelector('h4').textContent.toLowerCase();
            const content = card.querySelector('p').textContent.toLowerCase();
            const cardCategory = card.dataset.category || 'all';
            
            const matchesSearch = title.includes(searchTerm) || content.includes(searchTerm);
            const matchesCategory = category === 'all' || cardCategory === category;
            
            // Get the parent column element
            const parentColumn = card.closest('[class*="col-"]');
            
            if (matchesSearch && matchesCategory) {
                card.style.display = 'flex';
                if (parentColumn) {
                    parentColumn.style.display = 'flex';
                }
            } else {
                card.style.display = 'none';
                if (parentColumn) {
                    parentColumn.style.display = 'none';
                }
            }
        });
    }

    // ============================================
    // SCROLL TO TOP BUTTON
    // ============================================
    
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    if (scrollToTopBtn) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        });
        
        // Scroll to top when button is clicked
        scrollToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ============================================
    // FILE UPLOAD PREVIEW
    // ============================================
    
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
        input.addEventListener('change', function(e) {
            const files = e.target.files;
            const preview = this.parentElement.querySelector('.file-preview');
            
            if (preview && files.length > 0) {
                preview.innerHTML = `<p>${files.length} file(s) selected</p>`;
            }
        });
    });


    // ============================================
    // INITIALIZE ON PAGE LOAD
    // ============================================
    
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Law Firm Website - All scripts loaded successfully');
        
        // Add loaded class to body
        document.body.classList.add('loaded');
    });

})();

