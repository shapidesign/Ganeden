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
    const addToCartButtons = document.querySelectorAll('.btn-add-cart');

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

    // Blob Cursor Logic
    const blobs = document.querySelectorAll('.blob');
    if (blobs.length > 0) {
        // Configuration
        const fastDuration = 0.1;
        const slowDuration = 0.5;
        const fastEase = 'power3.out';
        const slowEase = 'power1.out';

        // Initial position (center screen or off-screen)
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;

        // Track mouse movement
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Animate blobs
            blobs.forEach((blob, index) => {
                const isLead = index === 0;
                gsap.to(blob, {
                    x: mouseX,
                    y: mouseY,
                    duration: isLead ? fastDuration : slowDuration,
                    ease: isLead ? fastEase : slowEase,
                    overwrite: 'auto' // ensure new tweens overwrite old ones smoothly
                });
            });
        });

        // Handle window resize (optional, mainly for initial pos if needed)
        window.addEventListener('resize', () => {
             // Logic if needed
        });
    }
});
