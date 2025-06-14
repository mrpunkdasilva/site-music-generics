/**
 * PWA Handler Module
 * Handles PWA functionality including service worker registration,
 * installation prompts, and push notifications
 */

// Variable to store the deferred prompt event
let deferredPrompt;

/**
 * Initialize PWA functionality
 */
export function initPWA() {
  // Register service worker
  registerServiceWorker();
  
  // Setup install prompt
  setupInstallPrompt();
  
  // Setup push notifications (if supported)
  setupPushNotifications();
}

/**
 * Register the service worker
 */
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/js/service-worker.js')
        .then(registration => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });
    });
  }
}

/**
 * Setup the install prompt for PWA
 */
function setupInstallPrompt() {
  // Capture the install prompt event
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the default prompt
    e.preventDefault();
    
    // Store the event for later use
    deferredPrompt = e;
    
    // Show the install button
    showInstallButton();
  });
  
  // Listen for successful installation
  window.addEventListener('appinstalled', () => {
    // Hide the install button
    hideInstallButton();
    
    // Clear the deferred prompt
    deferredPrompt = null;
    
    // Log the installation
    console.log('PWA was installed');
  });
}

/**
 * Show the install button in the UI
 */
function showInstallButton() {
  const installButton = document.createElement('button');
  installButton.className = 'pwa-install-button';
  installButton.innerHTML = `
    <span class="install-icon">📱</span>
    <span class="install-text">Install App</span>
  `;
  installButton.setAttribute('aria-label', 'Install as application');
  
  // Add event listener to trigger installation
  installButton.addEventListener('click', triggerInstallPrompt);
  
  // Add to the DOM
  const header = document.querySelector('.header-container');
  if (header) {
    header.appendChild(installButton);
  }
}

/**
 * Hide the install button
 */
function hideInstallButton() {
  const installButton = document.querySelector('.pwa-install-button');
  if (installButton) {
    installButton.remove();
  }
}

/**
 * Trigger the install prompt
 */
function triggerInstallPrompt() {
  if (deferredPrompt) {
    // Show the prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      
      // Clear the deferred prompt
      deferredPrompt = null;
    });
  }
}

/**
 * Setup push notifications
 */
function setupPushNotifications() {
  if ('Notification' in window && 'PushManager' in window) {
    // Create notification button
    createNotificationButton();
  }
}

/**
 * Create notification permission button
 */
function createNotificationButton() {
  // Only create if notifications aren't already granted
  if (Notification.permission !== 'granted') {
    const notifyButton = document.createElement('button');
    notifyButton.className = 'notification-button';
    notifyButton.innerHTML = `
      <span class="notify-icon">🔔</span>
      <span class="notify-text">Enable Notifications</span>
    `;
    notifyButton.setAttribute('aria-label', 'Enable notifications for updates');
    
    // Add event listener
    notifyButton.addEventListener('click', requestNotificationPermission);
    
    // Add to the DOM - in the footer
    const footerLinks = document.querySelector('.footer-links');
    if (footerLinks) {
      const notifyItem = document.createElement('li');
      notifyItem.className = 'footer-link';
      notifyItem.appendChild(notifyButton);
      footerLinks.appendChild(notifyItem);
    }
  }
}

/**
 * Request notification permission
 */
async function requestNotificationPermission() {
  try {
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      // Subscribe to push notifications
      subscribeToPushNotifications();
      
      // Remove the notification button
      const notifyButton = document.querySelector('.notification-button');
      if (notifyButton) {
        notifyButton.parentElement.remove();
      }
      
      // Show a success message
      showNotificationSuccess();
    }
  } catch (error) {
    console.error('Error requesting notification permission:', error);
  }
}

/**
 * Subscribe to push notifications
 */
async function subscribeToPushNotifications() {
  try {
    const registration = await navigator.serviceWorker.ready;
    
    // This would typically communicate with your server to register the push subscription
    // For demo purposes, we're just logging it
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        // This should be your VAPID public key from your server
        'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U'
      )
    });
    
    console.log('User is subscribed to push notifications:', subscription);
    
    // In a real app, you would send this subscription to your server
    // sendSubscriptionToServer(subscription);
  } catch (error) {
    console.error('Failed to subscribe to push notifications:', error);
  }
}

/**
 * Show notification success message
 */
function showNotificationSuccess() {
  // Create a toast notification
  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.textContent = 'Notifications enabled successfully!';
  
  // Add to the DOM
  document.body.appendChild(toast);
  
  // Remove after 3 seconds
  setTimeout(() => {
    toast.classList.add('hide');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/**
 * Convert base64 string to Uint8Array for applicationServerKey
 */
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  
  return outputArray;
}

// Export functions for use in other modules
export default {
  initPWA,
  triggerInstallPrompt
};