document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-menu a');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            
            // Animate hamburger to X
            const spans = menuToggle.querySelectorAll('span');
            if (mobileMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Close menu when clicking a link
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                const spans = menuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }

    // Cart Counter
    let cartCount = 0;
    const cartCountElement = document.querySelector('.cart-count');
    const addToCartButtons = document.querySelectorAll('.btn-add-cart, .btn-add-pack');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            cartCount++;
            cartCountElement.textContent = cartCount;
            
            // Add a little bump animation to the cart count
            cartCountElement.style.transform = 'scale(1.3)';
            setTimeout(() => {
                cartCountElement.style.transform = 'scale(1)';
            }, 200);

            // Change button text temporarily
            const originalText = button.textContent;
            button.textContent = 'נוסף לאוסף';
            button.style.backgroundColor = 'var(--color-lime)';
            button.style.color = 'var(--color-dark-green)';
            
            setTimeout(() => {
                button.textContent = originalText;
                button.style.backgroundColor = '';
                button.style.color = '';
            }, 1000);
        });
    });

    // Hero Image Carousel
    const carouselImages = document.querySelectorAll('.carousel-image');
    if (carouselImages.length > 0) {
        let currentIndex = 0;
        const CHANGE_INTERVAL = 2000; // 2 seconds per image

        function showNextImage() {
            // Remove active class from current image
            carouselImages[currentIndex].classList.remove('active');
            
            // Move to next image
            currentIndex = (currentIndex + 1) % carouselImages.length;
            
            // Add active class to new image
            carouselImages[currentIndex].classList.add('active');
        }

        // Start the carousel
        setInterval(showNextImage, CHANGE_INTERVAL);
    }

    // Interactive Map - Partner Dots
    const partnerDots = document.querySelectorAll('.partner-dot');
    const tooltip = document.getElementById('partner-tooltip');

    if (tooltip && partnerDots.length > 0) {
        partnerDots.forEach(dot => {
            dot.addEventListener('mouseenter', (e) => {
                const name = dot.getAttribute('data-name');
                const products = dot.getAttribute('data-products');
                
                tooltip.querySelector('.tooltip-title').textContent = name;
                tooltip.querySelector('.tooltip-products').textContent = products;
                tooltip.classList.add('active');
            });

            dot.addEventListener('mousemove', (e) => {
                const mapContainer = document.querySelector('.map-container');
                const rect = mapContainer.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                tooltip.style.left = `${x + 20}px`;
                tooltip.style.top = `${y - 40}px`;
            });

            dot.addEventListener('mouseleave', () => {
                tooltip.classList.remove('active');
            });

            // Add click animation
            dot.addEventListener('click', () => {
                dot.querySelector('circle').style.animation = 'none';
                setTimeout(() => {
                    dot.querySelector('circle').style.animation = 'pulse 2s ease-in-out infinite';
                }, 10);
            });
        });
    }
});
