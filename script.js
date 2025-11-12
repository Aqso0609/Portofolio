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
      loadAdminComments();
    }
    // Logout admin
    if (adminPage) {
      const logoutBtn = document.getElementById("logout-admin");
      logoutBtn.addEventListener("click", function() {
        localStorage.removeItem("loginRole");
        location.reload();
      });
    }
    // Load & manage comments in admin
    function loadAdminComments() {
      fetch(COMMENT_API)
        .then(res => res.json())
        .then(comments => {
          const list = document.getElementById("admin-comments-list");
          if (!list) return;
          if (!comments.length) {
            list.innerHTML = '<div style="color:#888;text-align:center;">No comments yet.</div>';
            return;
          }
          list.innerHTML = comments.map((c) => `
            <div style="background:#fff3cd;border-radius:8px;padding:1em 1.5em;margin-bottom:1em;box-shadow:0 2px 8px rgba(0,0,0,0.04);position:relative;">
              <b style=\"color:#b8860b;\">${c.name}</b><br>
              <span style=\"color:#333;\">${c.comment}</span><br>
              <small style=\"color:#888;\">${new Date(c.created_at).toLocaleString()}</small>
              <button class='delete-comment-btn' data-id='${c.id}' style='position:absolute;top:1em;right:1em;background:#dc3545;color:#fff;border:none;padding:0.3em 0.8em;border-radius:5px;cursor:pointer;'>Delete</button>
            </div>
          `).join("");
          // Add delete handlers
          document.querySelectorAll('.delete-comment-btn').forEach(btn => {
            btn.addEventListener('click', function() {
              const id = this.getAttribute('data-id');
              deleteComment(id);
            });
          });
        });
    }
    function deleteComment(idx) {
      fetch(COMMENT_API + `/${id}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(() => loadAdminComments());
    }
  }
  // Initialize all functionality (setelah login)
  initializeLoading();
  initializeNavigation();
  initializeScrollAnimations();
  initializePortfolioFilter();
  initializeContactForm();
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

// Scroll Animations
function initializeScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible")
      }
    })
  }, observerOptions)

  // Observe all elements with fade-in class
  const fadeElements = document.querySelectorAll(".fade-in")
  fadeElements.forEach((element) => {
    observer.observe(element)
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

// Contact Form
function initializeContactForm() {
  const contactForm = document.getElementById("contact-form")

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault()

    // Get form data
    const formData = new FormData(this)
    const name = formData.get("name")
    const email = formData.get("email")
    const subject = formData.get("subject")
    const message = formData.get("message")

    // Basic validation
    if (!name || !email || !subject || !message) {
      showNotification("Please fill in all fields.", "error")
      return
    }

    if (!isValidEmail(email)) {
      showNotification("Please enter a valid email address.", "error")
      return
    }

    // Simulate form submission
    const submitButton = this.querySelector(".submit-button")
    const originalText = submitButton.textContent

    submitButton.textContent = "Sending..."
    submitButton.disabled = true

    setTimeout(() => {
      showNotification("Thank you! Your message has been sent successfully.", "success")
      contactForm.reset()
      submitButton.textContent = originalText
      submitButton.disabled = false
    }, 2000)
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

// === COMMENT SYSTEM (NEON) ===
const COMMENT_API = 'http://localhost:3001/api/comments';

// Show/hide comment sections
function showCommentSection(section) {
  document.getElementById('comment').style.display = section === 'form' ? '' : 'none';
  document.getElementById('show-comments').style.display = section === 'show' ? '' : 'none';
}

// Load comments for both sections
async function loadComments(targetId = 'comments-list') {
  try {
    const res = await fetch(COMMENT_API);
    const comments = await res.json();
    const list = document.getElementById(targetId);
    if (!list) return Promise.resolve();
    if (comments.length === 0) {
      list.innerHTML = '<div style="text-align:center;color:#888;">Belum ada komentar.</div>';
      return Promise.resolve();
    }
    list.innerHTML = comments.map(c => `
      <div style=\"background:#fff3cd;border-radius:8px;padding:1em 1.5em;margin-bottom:1em;box-shadow:0 2px 8px rgba(0,0,0,0.04);\">
        <b style=\"color:#b8860b;\">${c.name}</b><br>
        <span style=\"color:#333;\">${c.comment}</span><br>
        <small style=\"color:#888;\">${new Date(c.created_at).toLocaleString()}</small>
      </div>
    `).join('');
  } catch (err) {
    const list = document.getElementById(targetId);
    if (list) list.innerHTML = '<div style="color:red;text-align:center;">Gagal memuat komentar.</div>';
  }
  return Promise.resolve();
}

// Add navigation button for show comment
document.addEventListener('DOMContentLoaded', () => {
  // Add toggle show/hide comments button
  if (!document.getElementById('toggle-comment-btn')) {
    const btn = document.createElement('button');
    btn.id = 'toggle-comment-btn';
    btn.textContent = 'Show All Comments';
    btn.className = 'submit-button';
    btn.style.margin = '1rem auto 0 auto';
    btn.style.display = 'block';
    const commentSection = document.getElementById('comment');
    commentSection.appendChild(btn);
    let commentsVisible = false;
    btn.addEventListener('click', () => {
      commentsVisible = !commentsVisible;
      if (commentsVisible) {
        showCommentSection('show');
        loadComments('all-comments-list').then(() => {
          // Scroll ke bawah tepat ke section komentar
          const showSection = document.getElementById('show-comments');
          if (showSection) {
            window.scrollTo({ top: showSection.offsetTop - 40, behavior: 'smooth' });
          }
        });
        btn.textContent = 'Hide Comments';
      } else {
        showCommentSection('form');
        btn.textContent = 'Show All Comments';
        // Scroll ke bawah ke form komentar
        setTimeout(() => {
          const commentSection = document.getElementById('comment');
          if (commentSection) {
            window.scrollTo({ top: commentSection.offsetTop - 40, behavior: 'smooth' });
          }
        }, 100);
      }
    });
  }
  // Add back button to show-comments section
  if (!document.getElementById('back-to-form-btn')) {
    const backBtn = document.createElement('button');
    backBtn.id = 'back-to-form-btn';
    backBtn.textContent = 'Back to Comment Form';
    backBtn.className = 'submit-button';
    backBtn.style.margin = '1rem auto 0 auto';
    backBtn.style.display = 'block';
    const showSection = document.getElementById('show-comments');
    showSection.appendChild(backBtn);
    backBtn.addEventListener('click', () => {
      showCommentSection('form');
      window.scrollTo({top: document.getElementById('comment').offsetTop - 70, behavior: 'smooth'});
    });
  }
  // Initial load
  loadComments();
  showCommentSection('form');
  // Comment form handler
  const commentForm = document.getElementById('comment-form');
  if (commentForm) {
    commentForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const name = document.getElementById('comment-name').value.trim();
      const comment = document.getElementById('comment-message').value.trim();
      if (!name || !comment) {
        showNotification('Nama dan komentar wajib diisi.', 'error');
        return;
      }
      const submitBtn = this.querySelector('.submit-button');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      try {
        const res = await fetch(COMMENT_API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, comment })
        });
        if (!res.ok) throw new Error('Gagal mengirim komentar');
        showNotification('Komentar berhasil dikirim!', 'success');
        this.reset();
        loadComments();
      } catch (err) {
        showNotification('Komentar gagal dikirim. Coba lagi.', 'error');
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }
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