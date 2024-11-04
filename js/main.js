// Enhanced Carousel Functionality
class Carousel {
    constructor(element) {
        this.carousel = element;
        this.slides = Array.from(this.carousel.querySelectorAll('.hero-slide'));
        this.dots = Array.from(this.carousel.querySelectorAll('.carousel-dot'));
        this.currentSlide = 0;

        this.initCarousel();
    }

    initCarousel() {
        // Show first slide
        this.showSlide(0);

        // Add navigation dots functionality
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.showSlide(index));
        });

        // Auto advance slides
        setInterval(() => this.nextSlide(), 5000);
    }

    showSlide(index) {
        // Hide all slides
        this.slides.forEach(slide => {
            slide.style.display = 'none';
            slide.style.opacity = '0';
        });

        // Remove active class from all dots
        this.dots.forEach(dot => dot.classList.remove('active'));

        // Show current slide
        this.slides[index].style.display = 'grid';
        setTimeout(() => {
            this.slides[index].style.opacity = '1';
        }, 100);

        // Update active dot
        this.dots[index].classList.add('active');
        this.currentSlide = index;
    }

    nextSlide() {
        const next = (this.currentSlide + 1) % this.slides.length;
        this.showSlide(next);
    }

    prevSlide() {
        const prev = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.showSlide(prev);
    }
}

// Initialize carousel
document.addEventListener('DOMContentLoaded', () => {
    const carousel = new Carousel(document.querySelector('.hero-section'));
});

// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navMenu = document.querySelector('.nav-menu');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        mobileMenuBtn.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Close mobile menu when clicking a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Add this to your existing mobile menu JavaScript
document.querySelectorAll('.dropdown').forEach(dropdown => {
    const dropdownLink = dropdown.querySelector('.nav-link');

    // For mobile devices, prevent default behavior and toggle dropdown
    dropdownLink.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024) {
            e.preventDefault();
            dropdown.classList.toggle('active');

            // Toggle visibility of dropdown menu
            const dropdownMenu = dropdown.querySelector('.dropdown-menu');
            if (dropdown.classList.contains('active')) {
                dropdownMenu.style.display = 'block';
            } else {
                dropdownMenu.style.display = 'none';
            }
        }
    });
});

// Close other dropdowns when one is opened
document.querySelectorAll('.dropdown').forEach(dropdown => {
    dropdown.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024) {
            const otherDropdowns = document.querySelectorAll('.dropdown');
            otherDropdowns.forEach(other => {
                if (other !== dropdown) {
                    other.classList.remove('active');
                    const otherMenu = other.querySelector('.dropdown-menu');
                    otherMenu.style.display = 'none';
                }
            });
        }
    });
});

// Testimonial Slider functionality
class TestimonialSlider {
    constructor() {
        this.track = document.querySelector('.testimonials-track');
        this.cards = Array.from(document.querySelectorAll('.testimonial-card'));
        this.prevBtn = document.querySelector('.nav-btn.prev');
        this.nextBtn = document.querySelector('.nav-btn.next');

        this.currentIndex = 0;
        this.cardWidth = 0;
        this.maxIndex = 0;

        this.init();
    }

    init() {
        if (!this.track || this.cards.length === 0) return;

        this.calculateDimensions();
        this.bindEvents();
        this.updateNavigation();
    }

    calculateDimensions() {
        const containerWidth = this.track.parentElement.clientWidth;
        const gap = 32; // 3.2rem gap
        let cardsPerView = 3;

        if (window.innerWidth <= 768) {
            cardsPerView = 1;
        } else if (window.innerWidth <= 1200) {
            cardsPerView = 2;
        }

        this.cardWidth = (containerWidth - (gap * (cardsPerView - 1))) / cardsPerView;
        this.maxIndex = Math.max(0, this.cards.length - cardsPerView);

        // Update card widths
        this.cards.forEach(card => {
            card.style.width = `${this.cardWidth}px`;
            card.style.marginRight = `${gap}px`;
        });

        // Remove margin from last card
        this.cards[this.cards.length - 1].style.marginRight = '0';
    }

    bindEvents() {
        this.prevBtn?.addEventListener('click', () => this.navigate('prev'));
        this.nextBtn?.addEventListener('click', () => this.navigate('next'));

        // Handle window resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.calculateDimensions();
                this.updateSliderPosition();
                this.updateNavigation();
            }, 250);
        });

        // Touch events for mobile
        let touchStartX = 0;
        let touchEndX = 0;

        this.track.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        });

        this.track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > 50) { // Minimum swipe distance
                if (diff > 0) {
                    this.navigate('next');
                } else {
                    this.navigate('prev');
                }
            }
        });
    }

    navigate(direction) {
        if (direction === 'next' && this.currentIndex < this.maxIndex) {
            this.currentIndex++;
        } else if (direction === 'prev' && this.currentIndex > 0) {
            this.currentIndex--;
        }

        this.updateSliderPosition();
        this.updateNavigation();
    }

    updateSliderPosition() {
        const translate = -this.currentIndex * this.cardWidth;
        this.track.style.transform = `translateX(${translate}px)`;
    }

    updateNavigation() {
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentIndex <= 0;
        }
        if (this.nextBtn) {
            this.nextBtn.disabled = this.currentIndex >= this.maxIndex;
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TestimonialSlider();
});