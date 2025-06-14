/**
 * Gallery Module
 * Handles the media gallery with photos and videos,
 * including lightbox functionality
 */

/**
 * Initialize the gallery
 */
export function initGallery() {
  // Setup lightbox for images
  setupLightbox();
  
  // Setup video player
  setupVideoPlayer();
  
  // Setup gallery filtering
  setupGalleryFilter();
}

/**
 * Setup lightbox for gallery images
 */
function setupLightbox() {
  // Find all gallery images
  const galleryImages = document.querySelectorAll('.gallery-item img');
  
  // Create lightbox elements if they don't exist
  if (!document.querySelector('.lightbox')) {
    createLightboxElements();
  }
  
  // Get lightbox elements
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = document.querySelector('.lightbox-img');
  const lightboxVideo = document.querySelector('.lightbox-video');
  const lightboxCaption = document.querySelector('.lightbox-caption');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxNext = document.querySelector('.lightbox-next');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  
  // Add click event to gallery images
  galleryImages.forEach((img, index) => {
    img.addEventListener('click', () => {
      openLightbox(img, index);
    });
    
    // Add keyboard accessibility
    img.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(img, index);
      }
    });
  });
  
  // Close lightbox when clicking the close button
  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }
  
  // Close lightbox when clicking outside the image
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }
  
  // Navigate with arrow buttons
  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      navigateGallery(1);
    });
  }
  
  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      navigateGallery(-1);
    });
  }
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      navigateGallery(1);
    } else if (e.key === 'ArrowLeft') {
      navigateGallery(-1);
    }
  });
}

/**
 * Create lightbox elements
 */
function createLightboxElements() {
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-hidden', 'true');
  lightbox.setAttribute('aria-label', 'Visualizador de imagens');
  
  lightbox.innerHTML = `
    <div class="lightbox-content">
      <button class="lightbox-close" aria-label="Fechar visualizador">&times;</button>
      <button class="lightbox-prev" aria-label="Imagem anterior">&#10094;</button>
      <button class="lightbox-next" aria-label="Próxima imagem">&#10095;</button>
      <img class="lightbox-img" alt="">
      <video class="lightbox-video" controls></video>
      <div class="lightbox-caption"></div>
    </div>
  `;
  
  document.body.appendChild(lightbox);
}

/**
 * Open the lightbox with the selected image
 * @param {HTMLImageElement} img - The clicked image
 * @param {number} index - The index of the image in the gallery
 */
function openLightbox(img, index) {
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = document.querySelector('.lightbox-img');
  const lightboxVideo = document.querySelector('.lightbox-video');
  const lightboxCaption = document.querySelector('.lightbox-caption');
  
  if (!lightbox || !lightboxImg || !lightboxVideo || !lightboxCaption) return;
  
  // Store the current index for navigation
  lightbox.dataset.currentIndex = index;
  
  // Get the gallery item
  const galleryItem = img.closest('.gallery-item');
  const isVideo = galleryItem.classList.contains('video-item');
  
  if (isVideo) {
    // Handle video
    const videoSrc = galleryItem.dataset.videoSrc;
    lightboxVideo.src = videoSrc;
    lightboxVideo.style.display = 'block';
    lightboxImg.style.display = 'none';
    
    // Play the video
    lightboxVideo.play();
  } else {
    // Handle image
    const fullSrc = img.dataset.fullSrc || img.src;
    lightboxImg.src = fullSrc;
    lightboxImg.alt = img.alt;
    lightboxImg.style.display = 'block';
    lightboxVideo.style.display = 'none';
    
    // Pause any playing video
    lightboxVideo.pause();
  }
  
  // Set caption
  const caption = galleryItem.querySelector('.gallery-caption');
  lightboxCaption.textContent = caption ? caption.textContent : '';
  
  // Show the lightbox
  lightbox.classList.add('active');
  lightbox.setAttribute('aria-hidden', 'false');
  
  // Trap focus in the lightbox
  trapFocus(lightbox);
  
  // Disable page scrolling
  document.body.style.overflow = 'hidden';
}

/**
 * Close the lightbox
 */
function closeLightbox() {
  const lightbox = document.querySelector('.lightbox');
  const lightboxVideo = document.querySelector('.lightbox-video');
  
  if (!lightbox) return;
  
  // Hide the lightbox
  lightbox.classList.remove('active');
  lightbox.setAttribute('aria-hidden', 'true');
  
  // Pause any playing video
  if (lightboxVideo) {
    lightboxVideo.pause();
  }
  
  // Re-enable page scrolling
  document.body.style.overflow = '';
  
  // Restore focus to the previously focused element
  const focusedElement = document.querySelector('[data-lightbox-focused]');
  if (focusedElement) {
    focusedElement.focus();
    focusedElement.removeAttribute('data-lightbox-focused');
  }
}

/**
 * Navigate through gallery images
 * @param {number} direction - Direction to navigate (1 for next, -1 for previous)
 */
function navigateGallery(direction) {
  const lightbox = document.querySelector('.lightbox');
  if (!lightbox) return;
  
  // Get all gallery items
  const galleryItems = document.querySelectorAll('.gallery-item:not(.hidden)');
  if (galleryItems.length === 0) return;
  
  // Get current index
  let currentIndex = parseInt(lightbox.dataset.currentIndex) || 0;
  
  // Calculate new index
  let newIndex = currentIndex + direction;
  
  // Handle wrapping
  if (newIndex < 0) {
    newIndex = galleryItems.length - 1;
  } else if (newIndex >= galleryItems.length) {
    newIndex = 0;
  }
  
  // Get the image at the new index
  const newItem = galleryItems[newIndex];
  const newImg = newItem.querySelector('img');
  
  if (newImg) {
    openLightbox(newImg, newIndex);
  }
}

/**
 * Trap focus within the lightbox for accessibility
 * @param {HTMLElement} lightbox - The lightbox element
 */
function trapFocus(lightbox) {
  // Store the element that had focus before opening the lightbox
  if (!document.querySelector('[data-lightbox-focused]')) {
    document.activeElement.setAttribute('data-lightbox-focused', 'true');
  }
  
  // Focus the close button
  const closeButton = lightbox.querySelector('.lightbox-close');
  if (closeButton) {
    closeButton.focus();
  }
  
  // Get all focusable elements
  const focusableElements = lightbox.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  const firstFocusableElement = focusableElements[0];
  const lastFocusableElement = focusableElements[focusableElements.length - 1];
  
  // Handle tab key to trap focus
  lightbox.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    
    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstFocusableElement) {
        e.preventDefault();
        lastFocusableElement.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastFocusableElement) {
        e.preventDefault();
        firstFocusableElement.focus();
      }
    }
  });
}

/**
 * Setup video player functionality
 */
function setupVideoPlayer() {
  // Find all video items
  const videoItems = document.querySelectorAll('.gallery-item.video-item');
  
  videoItems.forEach(item => {
    const thumbnail = item.querySelector('img');
    const playButton = document.createElement('button');
    playButton.className = 'video-play-button';
    playButton.innerHTML = '▶';
    playButton.setAttribute('aria-label', 'Reproduzir vídeo');
    
    // Add play button to the item
    item.appendChild(playButton);
    
    // Add click event to play button
    playButton.addEventListener('click', () => {
      const videoSrc = item.dataset.videoSrc;
      if (videoSrc) {
        // Open lightbox with video
        openLightbox(thumbnail, Array.from(document.querySelectorAll('.gallery-item:not(.hidden)')).indexOf(item));
      }
    });
  });
}

/**
 * Setup gallery filtering
 */
function setupGalleryFilter() {
  const filterButtons = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  if (filterButtons.length === 0) return;
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      button.classList.add('active');
      
      // Get filter value
      const filter = button.dataset.filter;
      
      // Filter gallery items
      galleryItems.forEach(item => {
        if (filter === 'all') {
          item.classList.remove('hidden');
        } else if (item.classList.contains(filter)) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
}

// Export functions for use in other modules
export default {
  initGallery,
  openLightbox,
  closeLightbox
};