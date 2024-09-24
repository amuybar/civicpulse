function initializeNavbar() {
  const menuIcon = document.querySelector("#open-menu");
  const closeIcon = document.querySelector("#close-menu");
  const navbarLinks = document.querySelector(".navbar-links");

  function toggleMenu() {
    navbarLinks.classList.toggle("active");
    menuIcon.classList.toggle("active");
    closeIcon.classList.toggle("active");
    console.log("Menu toggled");
  }

  if (menuIcon) {
    menuIcon.addEventListener("click", toggleMenu);
    console.log("Menu icon event listener added");
  } else {
    console.error("Menu icon not found");
  }

  if (closeIcon) {
    closeIcon.addEventListener("click", toggleMenu);
    console.log("Close icon event listener added");
  } else {
    console.error("Close icon not found");
  }

  if (navbarLinks) {
    navbarLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (navbarLinks.classList.contains("active")) {
          toggleMenu();
        }
      });
    });
    console.log("Link click listeners added");
  } else {
    console.error("Navbar links not found");
  }

  // Add scroll effect
  window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar");
    if (navbar) {
      if (window.scrollY > 50) {
        navbar.style.background = "rgba(58, 28, 113, 0.9)";
        navbar.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.2)";
      } else {
        navbar.style.background =
          "linear-gradient(135deg, #3a1c71, #d76d77, #ffaf7b)";
        navbar.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
      }
    }
  });
}

// Listen for the custom event that signals the navbar has been loaded
window.addEventListener("navbarLoaded", initializeNavbar);

// Also initialize on DOMContentLoaded in case the event was missed
document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector(".navbar")) {
    initializeNavbar();
  }
});
