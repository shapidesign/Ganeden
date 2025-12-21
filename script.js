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

    // Draggable Shapes (Static & Randomly Placed)
    const shapes = document.querySelectorAll('.fun-shape');
    const container = document.querySelector('.hero-visuals');

    if (shapes.length > 0 && container) {
        shapes.forEach((shape, index) => {
            // Random Initial Position within container
            // Using a grid-like logic or pure random to spread them out
            // For pure random but contained:
            const containerRect = container.getBoundingClientRect();
            // shape size approx 150-200px
            
            // Calculate random positions (keeping them somewhat within the visual area)
            // We set them via style.top/left initially or transform. 
            // Let's use transform: translate(x, y) starting from 0,0 relative to parent
            // But CSS puts them in specific spots (top: 10%, etc). Let's override that in JS or rely on drag
            
            // Let's just randomize the initial x,y offsets from their CSS positions to make it feel "randomly placed"
            // Or better: unset the CSS positions in JS and set random ones.
            // Actually, simply setting random translations from origin 0,0 is easiest if we remove CSS positioning
            
            // Current CSS uses top/left/right/bottom. Let's rely on that for base layout but tweak it slightly random
            // Or fully random:
            
            let x = 0;
            let y = 0;
            
            // Randomize slightly from their CSS anchored positions to give "messy" look
            // No, user asked "randomly spaced and placed". 
            // Let's set initial transform to random values.
            
            // We'll just init X/Y to 0 relative to their CSS position, but let the user drag from there.
            // If we want "randomly placed" every refresh, we can add random offsets:
            x = (Math.random() - 0.5) * 100; // +/- 50px
            y = (Math.random() - 0.5) * 100; // +/- 50px
            let rotation = (Math.random() - 0.5) * 60; // Random tilt

            // Update DOM immediately
            shape.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`;

            let isDragging = false;
            let startX, startY;
            let initialObjX, initialObjY;

            // Drag Events
            shape.addEventListener('mousedown', startDrag);
            shape.addEventListener('touchstart', startDrag, {passive: false});

            function startDrag(e) {
                // Prevent default browser drag behavior (especially for images)
                e.preventDefault(); 
                
                isDragging = true;
                const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
                const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
                
                startX = clientX;
                startY = clientY;
                initialObjX = x;
                initialObjY = y;
                
                shape.style.cursor = 'grabbing';
                shape.style.zIndex = 100; // Bring to front while dragging
            }

            window.addEventListener('mousemove', drag);
            window.addEventListener('touchmove', drag, {passive: false});

            function drag(e) {
                if (!isDragging) return;
                e.preventDefault(); // Prevent scrolling on touch

                const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
                const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

                const dx = clientX - startX;
                const dy = clientY - startY;

                x = initialObjX + dx;
                y = initialObjY + dy;
                
                shape.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`;
            }

            window.addEventListener('mouseup', stopDrag);
            window.addEventListener('touchend', stopDrag);

            function stopDrag() {
                if (!isDragging) return;
                isDragging = false;
                shape.style.cursor = 'grab';
                shape.style.zIndex = ''; // Reset z-index
            }
        });
    }
});
