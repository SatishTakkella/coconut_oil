// Home Page Interactive Enhancements

document.addEventListener('DOMContentLoaded', function () {
    // Animate stats on scroll
    animateStats();

    // Add parallax effect to hero
    addParallaxEffect();

    // Animate elements on scroll
    animateOnScroll();

    // Add hover effects to product cards
    enhanceProductCards();

    // Smooth scroll for anchor links
    smoothScrollLinks();
});

// Animate statistics counter
function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const text = target.textContent;
                const number = parseInt(text.replace(/\D/g, ''));
                const suffix = text.replace(/[0-9]/g, '');

                if (!isNaN(number)) {
                    animateCounter(target, 0, number, suffix, 2000);
                }
                observer.unobserve(target);
            }
        });
    }, observerOptions);

    stats.forEach(stat => observer.observe(stat));
}

function animateCounter(element, start, end, suffix, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            element.textContent = end + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + suffix;
        }
    }, 16);
}

// Parallax effect for hero section
function addParallaxEffect() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = scrolled * 0.5;
        hero.style.backgroundPositionY = parallax + 'px';
    });
}

// Animate elements on scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.feature-card, .product-card, .benefit-item, .testimonial-card, .process-item');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// Enhance product cards with interactive effects
function enhanceProductCards() {
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-15px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Smooth scroll for anchor links
function smoothScrollLinks() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Add floating coconut animation
function addFloatingCoconuts() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    for (let i = 0; i < 5; i++) {
        const coconut = document.createElement('div');
        coconut.textContent = '🥥';
        coconut.style.cssText = `
            position: absolute;
            font-size: ${Math.random() * 2 + 1}rem;
            opacity: ${Math.random() * 0.3 + 0.1};
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation: float ${Math.random() * 10 + 5}s ease-in-out infinite;
            animation-delay: ${Math.random() * 5}s;
            pointer-events: none;
        `;
        hero.appendChild(coconut);
    }
}

// Add to cart functionality
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function () {
        const product = this.getAttribute('data-product');
        addToCart(product);

        // Visual feedback
        this.innerHTML = '<i class="fas fa-check"></i> Added!';
        this.style.background = '#28a745';

        setTimeout(() => {
            this.innerHTML = 'Add to Cart';
            this.style.background = '';
        }, 2000);

        // Update cart count
        updateCartCount();
    });
});

function addToCart(product) {
    // Get existing cart
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');

    // Add product
    cart.push({
        product: product,
        quantity: 1,
        timestamp: Date.now()
    });

    // Save cart
    localStorage.setItem('cart', JSON.stringify(cart));

    // Show notification
    showNotification(`${product} added to cart!`);
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = cart.length;

        // Animate cart icon
        cartCount.style.transform = 'scale(1.5)';
        setTimeout(() => {
            cartCount.style.transform = 'scale(1)';
        }, 300);
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #28a745, #20c997);
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideInRight 0.5s ease;
        font-weight: 600;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(style);

// Initialize cart count on page load
updateCartCount();

// Add scroll progress indicator
function addScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 4px;
        background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.pageYOffset / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

addScrollProgress();


// FAQ Accordion functionality
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', function () {
        const faqItem = this.parentElement;
        const isActive = faqItem.classList.contains('active');

        // Close all FAQ items
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
        });

        // Open clicked item if it wasn't active
        if (!isActive) {
            faqItem.classList.add('active');
        }
    });
});

// Newsletter form submission
document.getElementById('newsletter-form')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value;

    // Simulate subscription
    showNotification('🎉 Thank you for subscribing! Check your email for exclusive offers.');
    this.reset();
});

// Scroll to top button
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.className = 'scroll-to-top';
scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
document.body.appendChild(scrollToTopBtn);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Instagram items hover effect
document.querySelectorAll('.instagram-item').forEach(item => {
    item.addEventListener('click', function () {
        // Simulate opening Instagram post
        showNotification('Opening Instagram... Follow us @konaseemacoconutoil');
    });
});

// Comparison cards animation on scroll
const comparisonCards = document.querySelectorAll('.comparison-card');
if (comparisonCards.length > 0) {
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0) scale(1)';
                }, index * 200);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    comparisonCards.forEach((card, index) => {
        card.style.opacity = '0';
        if (index === 0) {
            card.style.transform = 'translateX(-50px) scale(0.95)';
        } else {
            card.style.transform = 'translateX(50px) scale(0.95)';
        }
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
}

// Trust badges animation
const trustBadges = document.querySelectorAll('.trust-badge-item');
trustBadges.forEach((badge, index) => {
    badge.style.opacity = '0';
    badge.style.transform = 'translateY(30px)';
    badge.style.transition = 'all 0.5s ease';

    setTimeout(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        observer.observe(badge);
    }, 100);
});

// Enhanced product card interactions
document.querySelectorAll('.product-card').forEach(card => {
    // Add ripple effect on click
    card.addEventListener('click', function (e) {
        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') return;

        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(45, 80, 22, 0.3);
            width: 100px;
            height: 100px;
            margin-left: -50px;
            margin-top: -50px;
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        ripple.style.left = e.clientX - card.getBoundingClientRect().left + 'px';
        ripple.style.top = e.clientY - card.getBoundingClientRect().top + 'px';

        card.style.position = 'relative';
        card.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        from {
            transform: scale(0);
            opacity: 1;
        }
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Lazy load images with fade-in effect
const lazyImages = document.querySelectorAll('img[loading="lazy"]');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.5s ease';

            img.addEventListener('load', () => {
                img.style.opacity = '1';
            });

            imageObserver.unobserve(img);
        }
    });
});

lazyImages.forEach(img => imageObserver.observe(img));

// Add typing effect to hero subtitle
const heroSubtitle = document.querySelector('.hero p');
if (heroSubtitle) {
    const text = heroSubtitle.textContent;
    heroSubtitle.textContent = '';
    heroSubtitle.style.opacity = '1';

    let index = 0;
    const typeSpeed = 50;

    setTimeout(() => {
        function typeWriter() {
            if (index < text.length) {
                heroSubtitle.textContent += text.charAt(index);
                index++;
                setTimeout(typeWriter, typeSpeed);
            }
        }
        typeWriter();
    }, 1000);
}

// Add mouse parallax effect to hero
const hero = document.querySelector('.hero');
if (hero) {
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;

        const moveX = (mouseX - 0.5) * 20;
        const moveY = (mouseY - 0.5) * 20;

        hero.style.backgroundPosition = `${50 + moveX}% ${50 + moveY}%`;
    });
}

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimize scroll animations
const optimizedScroll = debounce(() => {
    // Your scroll-based animations here
}, 10);

window.addEventListener('scroll', optimizedScroll);

console.log('🥥 Pure Heritage Konaseema - Home page loaded successfully!');
