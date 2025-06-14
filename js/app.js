/**
 * The Generics - Main Application Module
 * 
 * This is the main entry point for the application that imports and initializes
 * all the feature modules.
 */

// Import modules
import ThemeSwitcher from './modules/theme-switcher.js';
import PWAHandler from './modules/pwa-handler.js';
import ImageHandler from './modules/image-handler.js';
import Accessibility from './modules/accessibility.js';
import Gallery from './modules/gallery.js';

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize core functionality
  initCore();
  
  // Initialize feature modules
  initModules();
  
  // Initialize page-specific features
  initPageSpecific();
});

/**
 * Initialize core functionality
 */
function initCore() {
  // Initialize theme switcher
  ThemeSwitcher.initThemeSwitcher();
  
  // Initialize PWA features
  PWAHandler.initPWA();
  
  // Initialize image optimization
  ImageHandler.initImageOptimization();
  
  // Initialize accessibility features
  Accessibility.initAccessibility();
}

/**
 * Initialize feature modules
 */
function initModules() {
  // Check if gallery exists on the page
  if (document.querySelector('.gallery-container')) {
    Gallery.initGallery();
  }
  
  // Add more module initializations here as needed
}

/**
 * Initialize page-specific features
 */
function initPageSpecific() {
  // Get the current page
  const currentPage = getCurrentPage();
  
  // Initialize features specific to each page
  switch (currentPage) {
    case 'home':
      initHomePage();
      break;
    case 'store':
      initStorePage();
      break;
    case 'about':
      initAboutPage();
      break;
    default:
      // Default initialization for unknown pages
      break;
  }
}

/**
 * Get the current page based on the URL
 * @returns {string} The current page name
 */
function getCurrentPage() {
  const path = window.location.pathname;
  
  if (path.includes('store.html')) {
    return 'store';
  } else if (path.includes('about.html')) {
    return 'about';
  } else {
    return 'home';
  }
}

/**
 * Initialize home page specific features
 */
function initHomePage() {
  // Add home page specific initializations here
  console.log('Home page initialized');
  
  // Example: Initialize parallax effect on hero section
  initParallaxEffect();
}

/**
 * Initialize store page specific features
 */
function initStorePage() {
  // Add store page specific initializations here
  console.log('Store page initialized');
  
  // Example: Initialize product quick view
  initProductQuickView();
}

/**
 * Initialize about page specific features
 */
function initAboutPage() {
  // Add about page specific initializations here
  console.log('About page initialized');
  
  // Example: Initialize timeline animation
  initTimelineAnimation();
}

/**
 * Initialize parallax effect
 */
function initParallaxEffect() {
  const heroSection = document.querySelector('.hero');
  
  if (heroSection) {
    window.addEventListener('scroll', () => {
      const scrollPosition = window.scrollY;
      heroSection.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
    });
  }
}

/**
 * Initialize product quick view
 */
function initProductQuickView() {
  const productCards = document.querySelectorAll('.product-card');
  
  productCards.forEach(card => {
    const quickViewBtn = document.createElement('button');
    quickViewBtn.className = 'quick-view-btn';
    quickViewBtn.textContent = 'Quick View';
    quickViewBtn.setAttribute('aria-label', 'Quick view of the product');
    
    card.appendChild(quickViewBtn);
    
    quickViewBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const title = card.querySelector('.product-title').textContent;
      const price = card.querySelector('.product-price').textContent;
      const image = card.querySelector('.product-image').src;
      const description = card.dataset.description || 'Description not available';
      
      showQuickView(title, price, image, description);
    });
  });
}

/**
 * Show product quick view modal
 */
function showQuickView(title, price, image, description) {
  // Create modal if it doesn't exist
  if (!document.querySelector('.quick-view-modal')) {
    const modal = document.createElement('div');
    modal.className = 'quick-view-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-hidden', 'true');
    
    modal.innerHTML = `
      <div class="quick-view-content">
        <button class="quick-view-close" aria-label="Close quick view">&times;</button>
        <div class="quick-view-image">
          <img src="" alt="">
        </div>
        <div class="quick-view-details">
          <h3 class="quick-view-title"></h3>
          <p class="quick-view-price"></p>
          <p class="quick-view-description"></p>
          <button class="btn btn-primary add-to-cart-btn">Add to Cart</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    const closeBtn = modal.querySelector('.quick-view-close');
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });
    
    // Close on click outside
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    });
    
    // Add to cart button
    const addToCartBtn = modal.querySelector('.add-to-cart-btn');
    addToCartBtn.addEventListener('click', () => {
      const title = modal.querySelector('.quick-view-title').textContent;
      const price = modal.querySelector('.quick-view-price').textContent;
      const image = modal.querySelector('.quick-view-image img').src;
      
      // Use the existing addItemToCart function
      if (typeof addItemToCart === 'function') {
        addItemToCart(title, price, image);
        
        // Close the modal
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    });
  }
  
  // Update modal content
  const modal = document.querySelector('.quick-view-modal');
  modal.querySelector('.quick-view-title').textContent = title;
  modal.querySelector('.quick-view-price').textContent = price;
  modal.querySelector('.quick-view-description').textContent = description;
  
  const modalImg = modal.querySelector('.quick-view-image img');
  modalImg.src = image;
  modalImg.alt = title;
  
  // Show the modal
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  
  // Focus the close button
  setTimeout(() => {
    modal.querySelector('.quick-view-close').focus();
  }, 100);
}

/**
 * Initialize timeline animation
 */
function initTimelineAnimation() {
  const timelineItems = document.querySelectorAll('.timeline-item');
  
  if (timelineItems.length === 0) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2
  });
  
  timelineItems.forEach(item => {
    observer.observe(item);
  });
}