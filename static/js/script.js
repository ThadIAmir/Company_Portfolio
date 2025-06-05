// Essential JavaScript for Company Portfolio
'use strict';

// Theme Manager (Dark/Light mode)
class ThemeManager {
  constructor() {
    this.currentTheme = localStorage.getItem('theme') || 'light';
    this.init();
  }
  
  init() {
    document.documentElement.setAttribute('data-theme', this.currentTheme);
    
    // Theme toggle button
    document.addEventListener('click', (e) => {
      if (e.target.matches('.theme-toggle')) {
        this.toggle();
      }
    });
  }
  
  toggle() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', this.currentTheme);
    localStorage.setItem('theme', this.currentTheme);
  }
}

// Simple Modal Manager
class ModalManager {
  show(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  }
  
  hide(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }
  }
}

// Form Handler
class FormHandler {
  constructor() {
    this.init();
  }
  
  init() {
    document.addEventListener('submit', (e) => {
      if (e.target.matches('form[data-ajax]')) {
        e.preventDefault();
        this.handleSubmit(e.target);
      }
    });
  }
  
  async handleSubmit(form) {
    const formData = new FormData(form);
    const submitBtn = form.querySelector('[type="submit"]');
    
    // Show loading
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'در حال ارسال...';
    }
    
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
          'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]')?.value
        }
      });
      
      if (response.ok) {
        this.showMessage('پیام شما با موفقیت ارسال شد', 'success');
        form.reset();
      } else {
        throw new Error('خطا در ارسال');
      }
    } catch (error) {
      this.showMessage('خطا در ارسال پیام', 'error');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'ارسال';
      }
    }
  }
  
  showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 5px;
      color: white;
      background: ${type === 'success' ? '#28a745' : '#dc3545'};
      z-index: 9999;
    `;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
      messageDiv.remove();
    }, 3000);
  }
}

// Mobile Menu Handler
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      menuToggle.classList.toggle('active');
    });
  }
}

// Smooth Scroll for Navigation
function initSmoothScroll() {
  document.addEventListener('click', (e) => {
    if (e.target.matches('a[href^="#"]')) {
      e.preventDefault();
      const target = document.querySelector(e.target.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
}

// Loading Screen Handler
function hideLoadingScreen() {
  const loadingScreen = document.querySelector('.loading-screen');
  if (loadingScreen) {
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
      loadingScreen.style.display = 'none';
    }, 300);
  }
}

// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
  // Initialize managers
  window.themeManager = new ThemeManager();
  window.modalManager = new ModalManager();
  window.formHandler = new FormHandler();
  
  // Initialize features
  initMobileMenu();
  initSmoothScroll();
  
  // Hide loading screen
  setTimeout(hideLoadingScreen, 500);
  
  console.log('✅ Portfolio initialized');
});

// Global click handlers
document.addEventListener('click', (e) => {
  // Modal triggers
  if (e.target.matches('[data-modal]')) {
    window.modalManager.show(e.target.dataset.modal);
  }
  
  // Modal close
  if (e.target.matches('.modal-close, .modal-overlay')) {
    const modal = e.target.closest('.modal');
    if (modal) {
      window.modalManager.hide(modal.id);
    }
  }
});

// Close modals with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal[style*="flex"]').forEach(modal => {
      window.modalManager.hide(modal.id);
    });
  }
});
