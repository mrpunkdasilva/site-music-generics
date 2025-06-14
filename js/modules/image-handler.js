/**
 * Image Handler Module
 * Handles image optimization, lazy loading, and responsive images
 */

/**
 * Initialize image optimization features
 */
export function initImageOptimization() {
  // Setup lazy loading for images
  setupLazyLoading();
  
  // Setup responsive images
  setupResponsiveImages();
}

/**
 * Setup lazy loading for images
 */
function setupLazyLoading() {
  // Check if the browser supports native lazy loading
  if ('loading' in HTMLImageElement.prototype) {
    // Add loading="lazy" to all images that don't have it
    document.querySelectorAll('img:not([loading])').forEach(img => {
      img.setAttribute('loading', 'lazy');
    });
  } else {
    // Fallback for browsers that don't support native lazy loading
    setupIntersectionObserver();
  }
}

/**
 * Setup Intersection Observer for lazy loading images
 */
function setupIntersectionObserver() {
  // If Intersection Observer is not supported, do nothing
  if (!('IntersectionObserver' in window)) return;
  
  const lazyImages = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        
        // If there's a srcset defined, set that too
        if (img.dataset.srcset) {
          img.srcset = img.dataset.srcset;
        }
        
        // Remove the data attributes
        img.removeAttribute('data-src');
        img.removeAttribute('data-srcset');
        
        // Stop observing the image
        observer.unobserve(img);
      }
    });
  }, {
    rootMargin: '50px 0px',
    threshold: 0.01
  });
  
  lazyImages.forEach(img => {
    imageObserver.observe(img);
  });
}

/**
 * Setup responsive images
 */
function setupResponsiveImages() {
  // Find all images that should be responsive but don't have srcset
  const images = document.querySelectorAll('img:not([srcset]):not(.non-responsive)');
  
  images.forEach(img => {
    // Skip images that already have srcset or are marked as non-responsive
    if (img.hasAttribute('srcset') || img.classList.contains('non-responsive')) {
      return;
    }
    
    // Get the original src
    const src = img.getAttribute('src');
    
    // Skip if no src or if it's a data URL or SVG
    if (!src || src.startsWith('data:') || src.endsWith('.svg')) {
      return;
    }
    
    // Generate responsive image markup
    generateResponsiveImage(img, src);
  });
}

/**
 * Generate responsive image markup
 * @param {HTMLImageElement} img - The image element
 * @param {string} src - The original image source
 */
function generateResponsiveImage(img, src) {
  // Extract the file path and extension
  const lastDot = src.lastIndexOf('.');
  const path = src.substring(0, lastDot);
  const ext = src.substring(lastDot);
  
  // Check if WebP is supported
  const supportsWebP = localStorage.getItem('supportsWebP');
  
  if (supportsWebP === null) {
    // Test for WebP support if we haven't checked before
    testWebPSupport();
  }
  
  // Create a picture element
  const picture = document.createElement('picture');
  
  // Add WebP source if supported
  if (supportsWebP === 'true') {
    const webpSource = document.createElement('source');
    webpSource.type = 'image/webp';
    webpSource.srcset = `
      ${path}-small.webp 400w,
      ${path}-medium.webp 800w,
      ${path}-large.webp 1200w
    `;
    webpSource.sizes = img.sizes || '(max-width: 600px) 400px, (max-width: 1200px) 800px, 1200px';
    picture.appendChild(webpSource);
  }
  
  // Add original format source
  const source = document.createElement('source');
  source.srcset = `
    ${path}-small${ext} 400w,
    ${path}-medium${ext} 800w,
    ${path}-large${ext} 1200w
  `;
  source.sizes = img.sizes || '(max-width: 600px) 400px, (max-width: 1200px) 800px, 1200px';
  picture.appendChild(source);
  
  // Clone the original image attributes to a new img element
  const newImg = document.createElement('img');
  Array.from(img.attributes).forEach(attr => {
    if (attr.name !== 'src' && attr.name !== 'srcset') {
      newImg.setAttribute(attr.name, attr.value);
    }
  });
  
  // Set the src to the original image
  newImg.src = src;
  
  // Add the new img to the picture element
  picture.appendChild(newImg);
  
  // Replace the original img with the picture element
  img.parentNode.replaceChild(picture, img);
}

/**
 * Test if the browser supports WebP
 */
function testWebPSupport() {
  const webP = new Image();
  webP.onload = function() {
    const isSupported = (webP.width > 0) && (webP.height > 0);
    localStorage.setItem('supportsWebP', isSupported);
  };
  webP.onerror = function() {
    localStorage.setItem('supportsWebP', false);
  };
  webP.src = 'data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==';
}

// Export functions for use in other modules
export default {
  initImageOptimization,
  setupLazyLoading,
  setupResponsiveImages
};