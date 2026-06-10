/**
 * Website JavaScript
 * Handles responsive navigation, form submission, and interactions
 */

// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const nav = document.querySelector('nav');

if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener('click', () => {
    nav.classList.toggle('active');
  });
}

// Mobile dropdown toggle
// On desktop the dropdown is handled entirely by CSS :hover.
// On mobile (≤768px) tapping "Work" toggles the .open class on .nav-dropdown,
// which expands the sub-links inline. The burger menu stays open throughout —
// only the sub-links collapse when "Work" is tapped again.
const dropdownToggle = document.querySelector('.nav-dropdown > a');
const navDropdown = document.querySelector('.nav-dropdown');

if (dropdownToggle && navDropdown) {
  dropdownToggle.addEventListener('click', (e) => {
    // Only intercept on mobile (when nav is in collapsed mode)
    if (window.innerWidth <= 768) {
      e.preventDefault();
      navDropdown.classList.toggle('open');
    }
  });
}

// Close mobile menu when a link is clicked (but not the dropdown toggle or its children)
const navLinks = document.querySelectorAll('nav a');
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (nav.classList.contains('active')) {
      const isDropdownToggle = link === dropdownToggle;
      const isInsideDropdown = link.closest('.dropdown-menu');
      if (!isDropdownToggle && !isInsideDropdown) {
        nav.classList.remove('active');
      }
    }
  });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('header')) {
    if (nav && nav.classList.contains('active')) {
      nav.classList.remove('active');
    }
  }
});

// Smooth scroll behavior for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Add fade-in animation to elements on scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all sections for animation
document.querySelectorAll('section').forEach(section => {
  observer.observe(section);
});

// Form submission is handled in contact.html via the Forminit SDK

// Keyboard navigation enhancement
document.addEventListener('keydown', (e) => {
  // Close menu with Escape key
  if (e.key === 'Escape' && nav && nav.classList.contains('active')) {
    nav.classList.remove('active');
  }
});

// Lightbox
document.addEventListener('DOMContentLoaded', function () {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  const lb_img     = lightbox.querySelector('img');
  const lb_counter = lightbox.querySelector('.lightbox-counter');

  const allImgs = Array.from(document.querySelectorAll(
    '.editorial-hero-image img, .woc-hero, .project-grid img, .project-images img, .book-col img'
  ));
  if (!allImgs.length) return;

  let current = 0;

  function show(index) {
    current = (index + allImgs.length) % allImgs.length;
    lb_img.src = allImgs[current].src;
    lb_img.alt = allImgs[current].alt;
    lb_counter.textContent = (current + 1) + ' / ' + allImgs.length;
  }

  function open(index) {
    show(index);
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  allImgs.forEach(function (img, i) {
    img.addEventListener('click', function () { open(i); });
    // Hero image is position:absolute inside its container — attach click to container too
    const heroContainer = img.closest('.editorial-hero-image');
    if (heroContainer) {
      heroContainer.addEventListener('click', function () { open(i); });
    }
  });

  lightbox.querySelector('.lightbox-close').addEventListener('click', close);
  lightbox.querySelector('.lightbox-prev').addEventListener('click', function () { show(current - 1); });
  lightbox.querySelector('.lightbox-next').addEventListener('click', function () { show(current + 1); });

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) close();
  });

  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'ArrowLeft')  show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
    if (e.key === 'Escape')     close();
  });
});

// Loading optimization - defer non-critical images
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        img.classList.add('loaded');
        imageObserver.unobserve(img);
      }
    });
  }, {
    rootMargin: '50px'
  });
  
  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}
