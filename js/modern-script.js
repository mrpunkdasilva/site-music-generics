/**
 * The Generics - Modern Website JavaScript
 * 
 * This file contains all JavaScript functionality for the modern website of The Generics band.
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    const header = document.querySelector('.main-header');
    const skipLink = document.querySelector('.skip-link');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const cartItems = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.cart-total-price');
    const purchaseButton = document.querySelector('.btn-purchase');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const products = document.querySelectorAll('.product-card');

    // Mobile Navigation
    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            const expanded = mainNav.classList.contains('active');
            mobileNavToggle.setAttribute('aria-expanded', expanded);
        });
    }

    // Scroll Header
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Skip link for accessibility
    if (skipLink) {
        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.tabIndex = -1;
                target.focus();
            }
        });
    }

    // Cart functionality
    if (addToCartButtons) {
        addToCartButtons.forEach(button => {
            button.addEventListener('click', addToCartClicked);
        });
    }

    // Purchase button
    if (purchaseButton) {
        purchaseButton.addEventListener('click', purchaseClicked);
    }

    // Category filter in store
    if (categoryButtons) {
        categoryButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Filter products
                const category = this.getAttribute('data-category');
                
                products.forEach(product => {
                    if (category === 'all') {
                        product.style.display = 'block';
                    } else if (product.getAttribute('data-category') === category) {
                        product.style.display = 'block';
                    } else {
                        product.style.display = 'none';
                    }
                });
            });
        });
    }

    // Update cart when quantity changes
    document.addEventListener('click', function(event) {
        if (event.target && event.target.classList.contains('cart-quantity-input')) {
            const input = event.target;
            if (isNaN(input.value) || input.value <= 0) {
                input.value = 1;
            }
            updateCartTotal();
        }
    });

    // Remove item from cart
    document.addEventListener('click', function(event) {
        if (event.target && event.target.classList.contains('btn-danger')) {
            const button = event.target;
            button.closest('tr').remove();
            updateCartTotal();
        }
    });

    // Cart functions
    function addToCartClicked(event) {
        const button = event.target;
        const product = button.closest('.product-card');
        const title = product.querySelector('.product-title').innerText;
        const price = product.querySelector('.product-price').innerText;
        const imageSrc = product.querySelector('.product-image').src;
        
        addItemToCart(title, price, imageSrc);
        updateCartTotal();
    }

    function addItemToCart(title, price, imageSrc) {
        const cartRow = document.createElement('tr');
        cartRow.classList.add('cart-row');
        
        // Check if item is already in cart
        const cartItemNames = document.querySelectorAll('.cart-item-title');
        for (let i = 0; i < cartItemNames.length; i++) {
            if (cartItemNames[i].innerText === title) {
                // Show notification instead of alert
                showNotification('This item is already in your cart!', 'warning');
                return;
            }
        }
        
        const cartRowContents = `
            <td class="cart-item" data-label="Product">
                <img src="${imageSrc}" alt="${title}" class="cart-item-image">
                <span class="cart-item-title">${title}</span>
            </td>
            <td class="cart-price" data-label="Price">${price}</td>
            <td class="cart-quantity" data-label="Quantity">
                <input class="cart-quantity-input" type="number" value="1" min="1" aria-label="Quantity of ${title}">
                <button class="btn btn-danger btn-sm" type="button" aria-label="Remove ${title} from cart">Remove</button>
            </td>
        `;
        
        cartRow.innerHTML = cartRowContents;
        cartItems.appendChild(cartRow);
        updateCartTotal();
    }

    function updateCartTotal() {
        if (!cartItems) return;
        
        const cartRows = cartItems.querySelectorAll('.cart-row');
        let total = 0;
        
        cartRows.forEach(row => {
            const priceElement = row.querySelector('.cart-price');
            const quantityElement = row.querySelector('.cart-quantity-input');
            
            const price = parseFloat(priceElement.innerText.replace('$', ''));
            const quantity = quantityElement.value;
            
            total += price * quantity;
        });
        
        total = Math.round(total * 100) / 100;
        cartTotal.innerText = '$' + total.toFixed(2);
    }

    function purchaseClicked() {
        // Show notification instead of alert
        showNotification('Thank you for your purchase!', 'success');
        
        // Clear cart
        while (cartItems.hasChildNodes()) {
            cartItems.removeChild(cartItems.firstChild);
        }
        
        updateCartTotal();
    }
    
    // Notification function
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <p>${message}</p>
                <button class="notification-close" aria-label="Close notification">&times;</button>
            </div>
        `;
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Add visible class after a small delay (for animation)
        setTimeout(() => {
            notification.classList.add('visible');
        }, 10);
        
        // Add close button functionality
        const closeButton = notification.querySelector('.notification-close');
        closeButton.addEventListener('click', () => {
            notification.classList.remove('visible');
            setTimeout(() => {
                notification.remove();
            }, 300); // Match transition time
        });
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.classList.remove('visible');
            setTimeout(() => {
                notification.remove();
            }, 300); // Match transition time
        }, 5000);
    }

    // Scroll animations
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.classList.add('animated');
            }
        });
    };

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on page load

    // Audio playback
    const playButton = document.querySelector('.btn-play');
    const audioPlayer = document.getElementById('audio-player');
    
    if (playButton && audioPlayer) {
        playButton.addEventListener('click', function() {
            if (audioPlayer.paused) {
                audioPlayer.play();
                playButton.innerHTML = '&#10074;&#10074;'; // Pause symbol
                playButton.setAttribute('aria-label', 'Pause music');
            } else {
                audioPlayer.pause();
                playButton.innerHTML = '&#9658;'; // Play symbol
                playButton.setAttribute('aria-label', 'Play music');
            }
        });
    }
});