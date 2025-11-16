// DOM Content Loaded
document.addEventListener("DOMContentLoaded", () => {
  // Tampilkan tombol logout jika sudah login visitor
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    if (localStorage.getItem("loginRole") === "visitor") {
      logoutBtn.style.display = "flex";
    } else {
      logoutBtn.style.display = "none";
    }
    logoutBtn.addEventListener("click", function() {
      localStorage.removeItem("loginRole");
      location.reload();
    });
  }
  // LOGIN PAGE LOGIC
  const loginPage = document.getElementById("login-page");
  const mainContent = document.querySelector("main");
  const navbar = document.getElementById("navbar");
  const footer = document.querySelector("footer");
  const adminPage = document.getElementById("admin-page");
  // Hide all except login by default
  if (loginPage) {
    mainContent.style.display = "none";
    if (navbar) navbar.style.display = "none";
    if (footer) footer.style.display = "none";
    if (adminPage) adminPage.style.display = "none";
    // Check if already logged in (localStorage)
    if (localStorage.getItem("loginRole") === "admin") {
      showAdminPage();
    } else if (localStorage.getItem("loginRole") === "visitor") {
      showMainContent();
    } else {
      loginPage.style.display = "flex";
    }
    // Login form handler
    const loginForm = document.getElementById("login-form");
    loginForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const email = document.getElementById("login-email").value.trim();
      const password = document.getElementById("login-password").value.trim();
      const errorDiv = document.getElementById("login-error");
      // Admin login
      if (email === "admin@gmail.com" && password === "admin123") {
        localStorage.setItem("loginRole", "admin");
        showAdminPage();
      } else if (email && password) {
        // Visitor login (any email/password except admin)
        localStorage.setItem("loginRole", "visitor");
        showMainContent();
      } else {
        errorDiv.textContent = "Email or password is required!";
        errorDiv.style.display = "block";
      }
    });
    // Visitor login button
    const visitorBtn = document.getElementById("visitor-login-btn");
    if (visitorBtn) {
      visitorBtn.addEventListener("click", function() {
        localStorage.setItem("loginRole", "visitor");
        showMainContent();
      });
    }
    function showMainContent() {
      loginPage.style.display = "none";
      mainContent.style.display = "block";
      if (navbar) navbar.style.display = "";
      if (footer) footer.style.display = "";
      if (adminPage) adminPage.style.display = "none";
    }
    function showAdminPage() {
      loginPage.style.display = "none";
      mainContent.style.display = "none";
      if (navbar) navbar.style.display = "none";
      if (footer) footer.style.display = "none";
      if (adminPage) adminPage.style.display = "block";
    }
    // Logout admin
    if (adminPage) {
      const logoutBtn = document.getElementById("logout-admin");
      if (logoutBtn) {
        logoutBtn.addEventListener("click", function() {
          localStorage.removeItem("loginRole");
          location.reload();
        });
      }
    }
  }
  // Initialize all functionality (setelah login)
  initializeLoading();
  initializeNavigation();
  initializeScrollAnimations();
  initializePortfolioFilter();
  initializeSmoothScroll();
});

// Loading Screen
function initializeLoading() {
  const loadingScreen = document.getElementById("loading-screen")

  window.addEventListener("load", () => {
    setTimeout(() => {
      loadingScreen.classList.add("fade-out")
      setTimeout(() => {
        loadingScreen.style.display = "none"
      }, 500)
    }, 1000)
  })
}

// Navigation
function initializeNavigation() {
  const navbar = document.getElementById("navbar")
  const hamburger = document.getElementById("hamburger")
  const navMenu = document.getElementById("nav-menu")
  const navLinks = document.querySelectorAll(".nav-link")

  // Navbar scroll effect with smooth transition
  window.addEventListener("scroll", () => {
    const currentScroll = window.scrollY;
    
    if (currentScroll > 50) {
      navbar.classList.add("scrolled")
    } else {
      navbar.classList.remove("scrolled")
    }
  })

  // Mobile menu toggle
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active")
    navMenu.classList.toggle("active")
  })

  // Close mobile menu when clicking on a link
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active")
      navMenu.classList.remove("active")
    })
  })

  // Active navigation link
  window.addEventListener("scroll", () => {
    let current = ""
    const sections = document.querySelectorAll("section")

    sections.forEach((section) => {
      const sectionTop = section.offsetTop
      const sectionHeight = section.clientHeight
      if (scrollY >= sectionTop - 200) {
        current = section.getAttribute("id")
      }
    })

    navLinks.forEach((link) => {
      link.classList.remove("active")
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active")
      }
    })
  })
}

// Scroll Animations - Enhanced
function initializeScrollAnimations() {
  const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -100px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Add stagger delay for multiple elements
        setTimeout(() => {
          entry.target.classList.add("visible")
        }, index * 100)
      }
    })
  }, observerOptions)

  // Observe all elements with fade-in class
  const fadeElements = document.querySelectorAll(".fade-in")
  fadeElements.forEach((element) => {
    observer.observe(element)
  })

  // Portfolio items animation
  const portfolioObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = "1"
          entry.target.style.transform = "translateY(0)"
        }, index * 150)
      }
    })
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  })

  const portfolioItems = document.querySelectorAll(".portfolio-item")
  portfolioItems.forEach((item) => {
    item.style.opacity = "0"
    item.style.transform = "translateY(50px)"
    item.style.transition = "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)"
    portfolioObserver.observe(item)
  })

  // Skills animation
  const skillCards = document.querySelectorAll(".skill-card")
  skillCards.forEach((card, index) => {
    card.style.opacity = "0"
    card.style.transform = "scale(0.8) translateY(30px)"
    card.style.transition = "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
    
    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = "1"
            entry.target.style.transform = "scale(1) translateY(0)"
          }, index * 100)
        }
      })
    }, { threshold: 0.2 })
    
    skillObserver.observe(card)
  })
}

// Portfolio Filter
function initializePortfolioFilter() {
  const filterButtons = document.querySelectorAll(".filter-btn")
  const portfolioItems = document.querySelectorAll(".portfolio-item")

  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const filter = this.getAttribute("data-filter")

      // Update active button
      filterButtons.forEach((btn) => btn.classList.remove("active"))
      this.classList.add("active")

      // Filter portfolio items
      portfolioItems.forEach((item) => {
        const category = item.getAttribute("data-category")

        if (filter === "all" || category === filter) {
          item.classList.remove("hidden")
          setTimeout(() => {
            item.style.display = "block"
          }, 10)
        } else {
          item.classList.add("hidden")
          setTimeout(() => {
            if (item.classList.contains("hidden")) {
              item.style.display = "none"
            }
          }, 300)
        }
      })
    })
  })
}


// Smooth Scroll
function initializeSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        // Cari section title di dalam section
        const sectionTitle = targetSection.querySelector('.section-title');
        let scrollToY = targetSection.offsetTop;
        const navbar = document.getElementById('navbar');
        const navbarHeight = navbar ? navbar.offsetHeight : 0;
        if (sectionTitle) {
          // Scroll agar judul section tepat di bawah navbar
          scrollToY = sectionTitle.getBoundingClientRect().top + window.scrollY - navbarHeight;
        } else {
          scrollToY = targetSection.getBoundingClientRect().top + window.scrollY - navbarHeight;
        }
        // Smooth scroll with native behavior
        window.scrollTo({
          top: scrollToY,
          behavior: "smooth",
        });
      }
    });
  });
}

// Utility Functions
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function showNotification(message, type) {
  // Create notification element
  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.textContent = message

  // Style the notification
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${type === "success" ? "#28a745" : "#dc3545"};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `

  document.body.appendChild(notification)

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)"
  }, 100)

  // Remove after 5 seconds
  setTimeout(() => {
    notification.style.transform = "translateX(100%)"
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 300)
  }, 5000)
}

// === SMOOTH SCROLL ENHANCEMENT ===
// Add smooth scroll behavior with proper offset for fixed navbar
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const navbarHeight = document.querySelector('.navbar').offsetHeight;
      const targetPosition = targetElement.offsetTop - navbarHeight - 20;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// Parallax Effect for Hero Section (Optional)
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset
  const hero = document.querySelector(".hero")
  const rate = scrolled * -0.5

  if (hero) {
    hero.style.transform = `translateY(${rate}px)`
  }
})

// Performance optimization: Throttle scroll events
function throttle(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Apply throttling to scroll events
const throttledScrollHandler = throttle(() => {
  // Scroll-dependent functions can be called here
}, 16) // ~60fps

window.addEventListener("scroll", throttledScrollHandler)

// Keyboard navigation support
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    // Close mobile menu if open
    const hamburger = document.getElementById("hamburger")
    const navMenu = document.getElementById("nav-menu")

    if (navMenu.classList.contains("active")) {
      hamburger.classList.remove("active")
      navMenu.classList.remove("active")
    }
  }
})

// Focus management for accessibility
document.addEventListener("DOMContentLoaded", () => {
  const focusableElements = document.querySelectorAll(
    'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])',
  )

  focusableElements.forEach((element) => {
    element.addEventListener("focus", function () {
      this.style.outline = "2px solid #b8860b"
      this.style.outlineOffset = "2px"
    })

    element.addEventListener("blur", function () {
      this.style.outline = ""
      this.style.outlineOffset = ""
    })
  })
})

// Add smooth hover effect to all links
document.addEventListener("DOMContentLoaded", () => {
  const allLinks = document.querySelectorAll('a:not(.nav-link)');
  allLinks.forEach(link => {
    link.addEventListener('mouseenter', function(e) {
      this.style.transition = 'all 0.3s ease';
    });
  });
});

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const hero = document.querySelector('.hero');
  if (hero) {
    const heroContent = hero.querySelector('.hero-container');
    if (heroContent && scrolled < window.innerHeight) {
      heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
      heroContent.style.opacity = 1 - (scrolled / window.innerHeight);
    }
  }
});

// Add animation to skill cards on hover
document.addEventListener("DOMContentLoaded", () => {
  const skillCards = document.querySelectorAll('.skill-card');
  skillCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
  });
});