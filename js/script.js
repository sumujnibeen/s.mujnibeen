// ==========================
// Function to load HTML components dynamically
// ==========================
function loadHTML(id, file, callback) {
  fetch(file)
    .then(response => response.text())
    .then(data => {
      document.getElementById(id).innerHTML = data;
      if (callback) callback();   // Run callback after load
    })
    .catch(err => console.error(`Error loading ${file}:`, err));
}

// ==========================
// Load all sections
// ==========================
loadHTML("header", "components/navbar.html");
loadHTML("intro", "components/intro.html");
loadHTML("introduction", "components/introduction.html");
loadHTML("my_works", "components/my_works.html", initMyWorks);
loadHTML("experience", "components/experience.html");
loadHTML("education", "components/education.html");
loadHTML("contact", "components/contact.html");
loadHTML("comments", "components/comment.html");
loadHTML("footer", "components/footer.html");

// ==========================
// Initialize My Works Navigation
// ==========================
function initMyWorks() {
  console.log("Initializing My Works after load");

  const buttons = document.querySelectorAll("#myWorksNav .works-nav-link");
  const sections = document.querySelectorAll(".work-content-section");

  console.log("Found buttons:", buttons.length);
  console.log("Found sections:", sections.length);

  if (!buttons.length || !sections.length) {
    console.warn("⚠ My Works elements not found yet");
    return;
  }

  buttons.forEach(btn => {
    btn.addEventListener("click", function(e) {
      e.preventDefault();
      e.stopPropagation();

      const target = this.dataset.target;
      console.log("Clicked:", target);

      // Activate button
      buttons.forEach(b => b.classList.remove("active"));
      this.classList.add("active");

      // Show section
      sections.forEach(s => s.classList.remove("active"));
      const targetSection = document.getElementById(target + "-content");
      if (targetSection) {
        targetSection.classList.add("active");
        console.log("✓ Showing:", target + "-content");
      } else {
        console.error("✗ Section not found:", target + "-content");
      }
    });
  });

  console.log("My Works navigation initialized successfully!");
}

// ==========================
// Smooth scroll for navbar & CTA buttons
// ==========================
document.addEventListener("click", function (e) {
  const link = e.target.closest("a");
  if (link && (link.classList.contains("nav-link") || link.classList.contains("btn"))) {
    const href = link.getAttribute("href");
    if (href && href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.substring(1);
      const targetElem = document.getElementById(targetId);
      if (targetElem) {
        window.scrollTo({
          top: targetElem.offsetTop - 70, // offset for fixed navbar
          behavior: "smooth",
        });
      }
      // collapse navbar on mobile after clicking
      const navbarCollapse = document.querySelector(".navbar-collapse");
      if (navbarCollapse && navbarCollapse.classList.contains("show")) {
        const bsCollapse = new bootstrap.Collapse(navbarCollapse, { toggle: true });
        bsCollapse.hide();
      }
    }
  }
});

// ==========================
// Highlight navbar link on scroll
// — Uses 80% from bottom rule (20% from top)
// — When multiple sections visible, highlights the one that's most prominent
// — At bottom of page, highlights contact section
// ==========================
window.addEventListener("scroll", () => {
  const navLinks = document.querySelectorAll(".nav-link[href^='#']");
  const scrollPosition = window.scrollY;
  const viewportHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  
  // Check if scrolled to bottom (within 50px)
  const isAtBottom = scrollPosition + viewportHeight >= documentHeight - 50;
  
  if (isAtBottom) {
    // At bottom, highlight contact section
    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === "#contact") {
        link.classList.add("active");
      }
    });
    return;
  }
  
  // Calculate the point that is 20% from the top of viewport (80% from bottom)
  // This is the "trigger point" - sections are considered active when they occupy this area
  const triggerPoint = scrollPosition + viewportHeight * 0.2;
  
  let bestMatch = {
    id: "",
    score: -1
  };
  
  navLinks.forEach((link) => {
    const id = link.getAttribute("href").substring(1);
    const section = document.getElementById(id);
    if (!section) return;
    
    const sectionTop = section.offsetTop;
    const sectionBottom = sectionTop + section.offsetHeight;
    
    // Calculate how much of the trigger point is within this section
    // Higher score means the trigger point is deeper within the section
    if (triggerPoint >= sectionTop && triggerPoint <= sectionBottom) {
      // Section contains the trigger point - this is the primary candidate
      const depth = triggerPoint - sectionTop;
      const percentage = depth / section.offsetHeight;
      // Higher score for sections where trigger point is lower (more visible)
      bestMatch = {
        id: id,
        score: percentage,
        link: link
      };
    } else if (triggerPoint > sectionBottom) {
      // Trigger point has passed this section, but track as fallback
      // Give higher score to sections that are closer to the trigger point
      const distance = triggerPoint - sectionBottom;
      const fallbackScore = 1 - (distance / viewportHeight);
      if (fallbackScore > bestMatch.score && fallbackScore > 0) {
        bestMatch = {
          id: id,
          score: fallbackScore,
          link: link
        };
      }
    }
  });
  
  // If no section contains the trigger point, find the section that is most visible
  if (bestMatch.id === "" && bestMatch.score === -1) {
    let maxVisibility = 0;
    navLinks.forEach((link) => {
      const id = link.getAttribute("href").substring(1);
      const section = document.getElementById(id);
      if (!section) return;
      
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      const visibleTop = Math.max(sectionTop, scrollPosition);
      const visibleBottom = Math.min(sectionBottom, scrollPosition + viewportHeight);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);
      const visibilityRatio = visibleHeight / section.offsetHeight;
      
      if (visibilityRatio > maxVisibility) {
        maxVisibility = visibilityRatio;
        bestMatch.id = id;
        bestMatch.link = link;
      }
    });
  }
  
  // Update active class
  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (bestMatch.link && link === bestMatch.link) {
      link.classList.add("active");
    }
  });
  
  // Special case: if at top of page, highlight introduction
  if (scrollPosition < 100) {
    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === "#introduction") {
        link.classList.add("active");
      }
    });
  }
});

// ==========================
// Hide mouse icon on small screens
// ==========================
function handleMouseIcon() {
  const mouseIcon = document.querySelector("#intro .mouse-icon");
  if (!mouseIcon) return;
  if (window.innerWidth < 768) {
    mouseIcon.style.display = "none";
  } else {
    mouseIcon.style.display = "block";
  }
}
window.addEventListener("resize", handleMouseIcon);
window.addEventListener("load", handleMouseIcon);

// ==========================
// Set current year in footer dynamically
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  const yearElem = document.getElementById("year");
  if (yearElem) {
    yearElem.innerText = new Date().getFullYear();
  }
});

// ==========================
// Trigger scroll on load to set initial active state
// ==========================
window.addEventListener("load", () => {
  // Small delay to ensure all sections are loaded
  setTimeout(() => {
    window.dispatchEvent(new Event('scroll'));
  }, 100);
});
