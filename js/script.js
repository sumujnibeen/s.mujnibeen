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
loadHTML("my_works", "components/my_works.html", initMyWorks);  // 👈 Added callback
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

  console.log(" My Works navigation initialized successfully!");
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
// ==========================
window.addEventListener("scroll", () => {
  const sections = document.querySelectorAll("section[id]");
  const scrollPos = window.scrollY + 80; // offset for navbar

  sections.forEach((section) => {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;
    const id = section.getAttribute("id");
    const navLink = document.querySelector(`.nav-link[href="#${id}"]`);

    if (scrollPos >= top && scrollPos < bottom) {
      navLink?.classList.add("active");
    } else {
      navLink?.classList.remove("active");
    }
  });
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