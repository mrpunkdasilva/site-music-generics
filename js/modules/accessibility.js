/**
 * Accessibility Module
 * Handles advanced accessibility features like font size control,
 * high contrast mode, and voice navigation
 */

// Local storage keys
const FONT_SIZE_KEY = 'the-generics-font-size';
const HIGH_CONTRAST_KEY = 'the-generics-high-contrast';
const HIGH_CONTRAST_TYPE_KEY = 'the-generics-high-contrast-type';

// Default values
let currentFontSize = parseInt(localStorage.getItem(FONT_SIZE_KEY) || '100');
let highContrastEnabled = localStorage.getItem(HIGH_CONTRAST_KEY) === 'true';
let highContrastType = localStorage.getItem(HIGH_CONTRAST_TYPE_KEY) || 'dark';

/**
 * Initialize accessibility features
 */
export function initAccessibility() {
  // Create accessibility controls
  createAccessibilityControls();
  
  // Apply saved settings
  applyFontSize();
  applyHighContrast();
  
  // Setup voice navigation if supported
  setupVoiceNavigation();
}

/**
 * Create accessibility controls in the UI
 */
function createAccessibilityControls() {
  // Create the accessibility panel
  const accessibilityPanel = document.createElement('div');
  accessibilityPanel.className = 'accessibility-panel';
  accessibilityPanel.setAttribute('aria-label', 'Controles de acessibilidade');
  
  // Create the toggle button
  const toggleButton = document.createElement('button');
  toggleButton.className = 'accessibility-toggle';
  toggleButton.innerHTML = '♿';
  toggleButton.setAttribute('aria-label', 'Abrir controles de acessibilidade');
  toggleButton.setAttribute('aria-expanded', 'false');
  toggleButton.setAttribute('aria-controls', 'accessibility-controls');
  
  // Create the controls container
  const controlsContainer = document.createElement('div');
  controlsContainer.className = 'accessibility-controls';
  controlsContainer.id = 'accessibility-controls';
  controlsContainer.setAttribute('aria-hidden', 'true');
  
  // Font size controls
  const fontSizeControls = document.createElement('div');
  fontSizeControls.className = 'font-size-controls';
  fontSizeControls.innerHTML = `
    <span class="control-label">Tamanho da Fonte</span>
    <div class="control-buttons">
      <button class="font-size-btn decrease" aria-label="Diminuir tamanho da fonte">A-</button>
      <span class="font-size-value">${currentFontSize}%</span>
      <button class="font-size-btn increase" aria-label="Aumentar tamanho da fonte">A+</button>
    </div>
  `;
  
  // High contrast toggle
  const contrastToggle = document.createElement('div');
  contrastToggle.className = 'contrast-toggle';
  contrastToggle.innerHTML = `
    <span class="control-label">Alto Contraste</span>
    <div class="contrast-controls">
      <label class="switch">
        <input type="checkbox" class="contrast-checkbox" aria-label="Ativar modo de alto contraste" ${highContrastEnabled ? 'checked' : ''}>
        <span class="slider"></span>
      </label>
      <div class="contrast-type-selector ${highContrastEnabled ? '' : 'hidden'}">
        <button class="contrast-type-btn dark ${highContrastType === 'dark' ? 'active' : ''}" aria-label="Fundo escuro" data-type="dark">
          <span class="contrast-icon">⬛</span>
        </button>
        <button class="contrast-type-btn light ${highContrastType === 'light' ? 'active' : ''}" aria-label="Fundo claro" data-type="light">
          <span class="contrast-icon">⬜</span>
        </button>
      </div>
    </div>
  `;
  
  // Voice navigation info
  const voiceNavInfo = document.createElement('div');
  voiceNavInfo.className = 'voice-nav-info';
  voiceNavInfo.innerHTML = `
    <span class="control-label">Navegação por Voz</span>
    <button class="voice-nav-btn" aria-label="Ativar navegação por voz">
      <span class="voice-icon">🎤</span>
      <span class="voice-text">Ativar</span>
    </button>
    <div class="voice-commands-info">
      Diga "ir para [página]" para navegar
    </div>
  `;
  
  // Add all controls to the container
  controlsContainer.appendChild(fontSizeControls);
  controlsContainer.appendChild(contrastToggle);
  controlsContainer.appendChild(voiceNavInfo);
  
  // Add the toggle button and controls to the panel
  accessibilityPanel.appendChild(toggleButton);
  accessibilityPanel.appendChild(controlsContainer);
  
  // Add the panel to the body
  document.body.appendChild(accessibilityPanel);
  
  // Add event listeners
  toggleButton.addEventListener('click', toggleAccessibilityPanel);
  
  // Font size buttons
  const decreaseBtn = fontSizeControls.querySelector('.decrease');
  const increaseBtn = fontSizeControls.querySelector('.increase');
  
  decreaseBtn.addEventListener('click', () => {
    changeFontSize(-10);
  });
  
  increaseBtn.addEventListener('click', () => {
    changeFontSize(10);
  });
  
  // High contrast toggle
  const contrastCheckbox = contrastToggle.querySelector('.contrast-checkbox');
  contrastCheckbox.addEventListener('change', toggleHighContrast);
  
  // High contrast type buttons
  const contrastTypeButtons = contrastToggle.querySelectorAll('.contrast-type-btn');
  contrastTypeButtons.forEach(button => {
    button.addEventListener('click', () => {
      highContrastType = button.dataset.type;
      localStorage.setItem(HIGH_CONTRAST_TYPE_KEY, highContrastType);
      
      // Update active state
      contrastTypeButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Apply high contrast
      applyHighContrast();
    });
  });
  
  // Voice navigation button
  const voiceNavBtn = voiceNavInfo.querySelector('.voice-nav-btn');
  voiceNavBtn.addEventListener('click', toggleVoiceNavigation);
}

/**
 * Toggle the accessibility panel
 */
function toggleAccessibilityPanel() {
  const panel = document.querySelector('.accessibility-panel');
  const controls = document.querySelector('.accessibility-controls');
  const toggle = document.querySelector('.accessibility-toggle');
  
  const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
  
  if (isExpanded) {
    controls.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-expanded', 'false');
    panel.classList.remove('expanded');
  } else {
    controls.setAttribute('aria-hidden', 'false');
    toggle.setAttribute('aria-expanded', 'true');
    panel.classList.add('expanded');
  }
}

/**
 * Change the font size
 * @param {number} delta - The amount to change (positive or negative)
 */
function changeFontSize(delta) {
  // Update the current font size
  currentFontSize = Math.max(70, Math.min(150, currentFontSize + delta));
  
  // Save to local storage
  localStorage.setItem(FONT_SIZE_KEY, currentFontSize.toString());
  
  // Update the display
  const fontSizeValue = document.querySelector('.font-size-value');
  if (fontSizeValue) {
    fontSizeValue.textContent = `${currentFontSize}%`;
  }
  
  // Apply the font size
  applyFontSize();
}

/**
 * Apply the current font size to the document
 */
function applyFontSize() {
  document.documentElement.style.fontSize = `${currentFontSize}%`;
}

/**
 * Toggle high contrast mode
 */
function toggleHighContrast() {
  highContrastEnabled = !highContrastEnabled;
  
  // Save to local storage
  localStorage.setItem(HIGH_CONTRAST_KEY, highContrastEnabled.toString());
  
  // Show/hide contrast type selector
  const contrastTypeSelector = document.querySelector('.contrast-type-selector');
  if (contrastTypeSelector) {
    if (highContrastEnabled) {
      contrastTypeSelector.classList.remove('hidden');
    } else {
      contrastTypeSelector.classList.add('hidden');
    }
  }
  
  // Apply high contrast
  applyHighContrast();
}

/**
 * Apply high contrast mode
 */
function applyHighContrast() {
  if (highContrastEnabled) {
    // Add high contrast class
    document.documentElement.classList.add('high-contrast');
    
    // Apply contrast type (light or dark)
    if (highContrastType === 'light') {
      document.documentElement.classList.add('light-contrast');
      document.documentElement.classList.remove('dark-contrast');
    } else {
      document.documentElement.classList.add('dark-contrast');
      document.documentElement.classList.remove('light-contrast');
    }
    
    // Ensure theme classes are removed when high contrast is enabled
    document.documentElement.classList.remove('dark-theme');
    document.documentElement.classList.remove('light-theme');
    
    // Update the contrast checkbox display
    const contrastCheckbox = document.querySelector('.contrast-checkbox');
    if (contrastCheckbox) {
      contrastCheckbox.checked = true;
    }
    
    // Update contrast type buttons
    const contrastTypeButtons = document.querySelectorAll('.contrast-type-btn');
    contrastTypeButtons.forEach(button => {
      if (button.dataset.type === highContrastType) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
    
    // Announce to screen readers
    const contrastTypeText = highContrastType === 'light' ? 'fundo claro' : 'fundo escuro';
    announceToScreenReader(`Modo de alto contraste com ${contrastTypeText} ativado`);
  } else {
    // Remove high contrast classes
    document.documentElement.classList.remove('high-contrast');
    document.documentElement.classList.remove('light-contrast');
    document.documentElement.classList.remove('dark-contrast');
    
    // Reapply the theme that was active before
    const savedTheme = localStorage.getItem('the-generics-theme-preference') || 'auto';
    if (savedTheme === 'dark' || (savedTheme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.classList.add('light-theme');
    }
    
    // Update the contrast checkbox display
    const contrastCheckbox = document.querySelector('.contrast-checkbox');
    if (contrastCheckbox) {
      contrastCheckbox.checked = false;
    }
    
    // Announce to screen readers
    announceToScreenReader('Modo de alto contraste desativado');
  }
}

/**
 * Announce a message to screen readers
 * @param {string} message - The message to announce
 */
function announceToScreenReader(message) {
  // Create a live region if it doesn't exist
  let announcer = document.getElementById('a11y-announcer');
  if (!announcer) {
    announcer = document.createElement('div');
    announcer.id = 'a11y-announcer';
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    document.body.appendChild(announcer);
  }
  
  // Set the message
  announcer.textContent = message;
  
  // Clear the message after a short delay
  setTimeout(() => {
    announcer.textContent = '';
  }, 3000);
}

/**
 * Setup voice navigation
 */
function setupVoiceNavigation() {
  // Check if the Web Speech API is supported
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    // Hide the voice navigation button if not supported
    const voiceNavInfo = document.querySelector('.voice-nav-info');
    if (voiceNavInfo) {
      voiceNavInfo.style.display = 'none';
    }
    return;
  }
  
  // Create a speech recognition instance
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  
  // Configure the recognition
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'pt-BR';
  
  // Handle results
  recognition.onresult = function(event) {
    const transcript = event.results[0][0].transcript.toLowerCase();
    console.log('Voice command:', transcript);
    
    // Process commands
    processVoiceCommand(transcript);
  };
  
  // Handle errors
  recognition.onerror = function(event) {
    console.error('Speech recognition error:', event.error);
    
    // Update UI to show error
    const voiceBtn = document.querySelector('.voice-nav-btn');
    if (voiceBtn) {
      voiceBtn.classList.remove('listening');
      voiceBtn.querySelector('.voice-text').textContent = 'Erro';
      
      // Reset after 2 seconds
      setTimeout(() => {
        voiceBtn.querySelector('.voice-text').textContent = 'Ativar';
      }, 2000);
    }
  };
  
  // Handle end of speech
  recognition.onend = function() {
    const voiceBtn = document.querySelector('.voice-nav-btn');
    if (voiceBtn) {
      voiceBtn.classList.remove('listening');
      voiceBtn.querySelector('.voice-text').textContent = 'Ativar';
    }
  };
  
  // Store the recognition instance for later use
  window.voiceRecognition = recognition;
}

/**
 * Toggle voice navigation on/off
 */
function toggleVoiceNavigation() {
  const recognition = window.voiceRecognition;
  const voiceBtn = document.querySelector('.voice-nav-btn');
  
  if (!recognition) return;
  
  if (voiceBtn.classList.contains('listening')) {
    // Stop listening
    recognition.stop();
    voiceBtn.classList.remove('listening');
    voiceBtn.querySelector('.voice-text').textContent = 'Ativar';
  } else {
    // Start listening
    recognition.start();
    voiceBtn.classList.add('listening');
    voiceBtn.querySelector('.voice-text').textContent = 'Ouvindo...';
  }
}

/**
 * Process a voice command
 * @param {string} command - The voice command
 */
function processVoiceCommand(command) {
  // Navigation commands
  if (command.includes('ir para')) {
    // Extract the destination
    let destination = command.replace('ir para', '').trim();
    
    // Map common destinations
    const destinations = {
      'home': 'index.html',
      'início': 'index.html',
      'página inicial': 'index.html',
      'loja': 'store.html',
      'sobre': 'about.html',
      'sobre nós': 'about.html',
      'shows': 'index.html#tours',
      'agenda': 'index.html#tours',
      'agenda de shows': 'index.html#tours',
      'música': 'index.html#music',
      'contato': 'index.html#contact'
    };
    
    // Navigate to the destination
    if (destinations[destination]) {
      window.location.href = destinations[destination];
    } else {
      // Provide feedback that the command wasn't understood
      speakFeedback(`Desculpe, não entendi o comando para ir para ${destination}`);
    }
  }
  
  // Font size commands
  else if (command.includes('aumentar fonte') || command.includes('aumentar tamanho')) {
    changeFontSize(10);
    speakFeedback('Tamanho da fonte aumentado');
  }
  else if (command.includes('diminuir fonte') || command.includes('diminuir tamanho')) {
    changeFontSize(-10);
    speakFeedback('Tamanho da fonte diminuído');
  }
  
  // High contrast commands
  else if (command.includes('ativar alto contraste') || command.includes('ligar contraste')) {
    if (!highContrastEnabled) {
      toggleHighContrast();
    }
    speakFeedback('Alto contraste ativado');
  }
  else if (command.includes('desativar alto contraste') || command.includes('desligar contraste')) {
    if (highContrastEnabled) {
      toggleHighContrast();
    }
    speakFeedback('Alto contraste desativado');
  }
  
  // Help command
  else if (command.includes('ajuda') || command.includes('comandos')) {
    speakFeedback('Você pode dizer: ir para home, ir para loja, aumentar fonte, diminuir fonte, ativar alto contraste, ou desativar alto contraste');
  }
  
  // Unknown command
  else {
    speakFeedback('Desculpe, não entendi esse comando');
  }
}

/**
 * Provide spoken feedback using speech synthesis
 * @param {string} text - The text to speak
 */
function speakFeedback(text) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    speechSynthesis.speak(utterance);
  }
}

// Export functions for use in other modules
export default {
  initAccessibility,
  changeFontSize,
  toggleHighContrast
};