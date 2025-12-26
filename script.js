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

    // Shopping Cart System
    let cart = [];
    const cartCountElement = document.querySelector('.cart-count');
    const cartModal = document.getElementById('cart-modal');
    const cartModalOverlay = document.querySelector('.cart-modal-overlay');
    const cartModalClose = document.querySelector('.cart-modal-close');
    const cartBtn = document.querySelector('.cart-btn');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');

    // Mock product data (in real app, this would come from a database)
    const productData = {
        'מלפפון': { name: 'מלפפון', price: 1.90, image: 'images/cucumber.jpg' },
        'גזר': { name: 'גזר', price: 3.00, image: 'images/carrot.jpg' },
        'בננה': { name: 'בננה', price: 4.00, image: 'images/banana.jpg' },
        'עגבניה': { name: 'עגבניה', price: 1.90, image: 'images/tomato.jpg' },
        'לימון': { name: 'לימון', price: 4.00, image: 'images/lemon.jpg' },
        'תפוז': { name: 'תפוז', price: 3.50, image: 'images/orange.jpg' },
        'חציל': { name: 'חציל', price: 4.50, image: 'images/eggplant.jpg' },
        'תות': { name: 'תות', price: 8.90, image: 'images/strawberry.jpg' },
        'מארז ירקות לתנור': { name: 'מארז ירקות לתנור', price: 3.00, image: 'images/packs/roots.png' },
        'פירות לשייק': { name: 'פירות לשייק', price: 5.00, image: 'images/packs/fruits.png' },
        'מארז שקשוקה': { name: 'מארז שקשוקה', price: 7.00, image: 'images/packs/shakshuka.png' }
    };

    function updateCart() {
        cartCountElement.textContent = cart.length;
        
        // Update cart display
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    <p>האוסף שלכם ריק</p>
                    <p class="empty-cart-subtext">הוסיפו מוצרים כדי להתחיל</p>
                </div>
            `;
        } else {
            cartItemsContainer.innerHTML = cart.map((item, index) => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h3 class="cart-item-name">${item.name}</h3>
                        <p class="cart-item-price">₪${item.price.toFixed(2)}</p>
                    </div>
                    <button class="cart-item-remove" data-index="${index}">×</button>
                </div>
            `).join('');

            // Add event listeners to remove buttons
            document.querySelectorAll('.cart-item-remove').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const index = parseInt(e.target.getAttribute('data-index'));
                    cart.splice(index, 1);
                    updateCart();
                });
            });
        }

        // Update total
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        cartTotalElement.textContent = `₪${total.toFixed(2)}`;
    }

    // Open cart modal
    if (cartBtn) {
        cartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            cartModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    // Close cart modal
    function closeCart() {
        cartModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (cartModalClose) {
        cartModalClose.addEventListener('click', closeCart);
    }

    if (cartModalOverlay) {
        cartModalOverlay.addEventListener('click', closeCart);
    }

    // Add to cart functionality
    const addToCartButtons = document.querySelectorAll('.btn-add-cart, .btn-add-pack');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Get product name from the card
            const card = button.closest('.product-card, .pack-card');
            const productNameElement = card.querySelector('h3');
            const productName = productNameElement.textContent.trim();
            
            // Get product data
            const product = productData[productName];
            
            if (product) {
                cart.push(product);
                updateCart();
                
                // Add bump animation to cart count
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
            }
        });
    });

    // Initialize cart display
    updateCart();

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
    const mapContainer = document.querySelector('.map-container');

    if (tooltip && partnerDots.length > 0 && mapContainer) {
        console.log('Map dots initialized:', partnerDots.length);
        
        // Update map rect dynamically
        const getMapRect = () => mapContainer.getBoundingClientRect();
        
        // Update rect on window resize and scroll
        let mapRect = getMapRect();
        window.addEventListener('resize', () => {
            mapRect = getMapRect();
        });
        window.addEventListener('scroll', () => {
            mapRect = getMapRect();
        });

        partnerDots.forEach(dot => {
            let isHovering = false;
            
            dot.addEventListener('mouseenter', (e) => {
                isHovering = true;
                mapRect = getMapRect(); // Update rect on each hover
                
                const name = dot.getAttribute('data-name');
                const products = dot.getAttribute('data-products');
                
                console.log('Hovering dot:', name);
                
                tooltip.querySelector('.tooltip-title').textContent = name;
                tooltip.querySelector('.tooltip-products').textContent = products;
                tooltip.classList.add('active');
                
                // Position tooltip relative to map container
                const x = e.clientX - mapRect.left;
                const y = e.clientY - mapRect.top;
                tooltip.style.left = `${x + 20}px`;
                tooltip.style.top = `${y - 40}px`;
                tooltip.style.visibility = 'visible';
            });

            dot.addEventListener('mousemove', (e) => {
                if (!isHovering) return;
                
                const x = e.clientX - mapRect.left;
                const y = e.clientY - mapRect.top;
                
                // Offset tooltip to avoid interfering with hover detection
                tooltip.style.left = `${x + 25}px`;
                tooltip.style.top = `${y - 45}px`;
            });

            dot.addEventListener('mouseleave', () => {
                isHovering = false;
                tooltip.classList.remove('active');
                tooltip.style.visibility = 'hidden';
            });
        });
    } else {
        console.log('Map initialization failed:', {
            tooltip: !!tooltip,
            dots: partnerDots.length,
            container: !!mapContainer
        });
    }
});
