import { isUserLoggedIn } from "./functions/isAuth.js";


function updateAuthLink() {
  const authLink = document.getElementById("auth-link").querySelector("a");

  if (isUserLoggedIn()) {
    authLink.textContent = "Profile"; 
    authLink.href = "#profile"; 
  } else {
    authLink.textContent = "Join"; 
    authLink.href = "#auth"; 
  }
}

function initializeNavbar() {
  const menuIcon = document.querySelector("#open-menu");
  const closeIcon = document.querySelector("#close-menu");
  const navbarLinks = document.querySelector(".navbar-links");
  const navbar = document.querySelector(".navbar");

  // Toggles the menu open/close states
  function toggleMenu() {
    navbarLinks.classList.toggle("active");
    menuIcon.classList.toggle("active");
    closeIcon.classList.toggle("active");
  }

  // Add event listener to open menu button if found
  if (menuIcon && closeIcon) {
    menuIcon.addEventListener("click", toggleMenu);
    closeIcon.addEventListener("click", toggleMenu);
    console.log("Menu and Close icon event listeners added");
  } else {
    console.error("Menu or Close icon not found");
  }

  // Close the menu when a link is clicked
  if (navbarLinks) {
    navbarLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (navbarLinks.classList.contains("active")) {
          toggleMenu(); // Close menu after clicking a link
        }
      });
    });
    console.log("Navbar link click listeners added");
  } else {
    console.error("Navbar links not found");
  }

  // Add scroll effect for changing navbar background and shadow
  if (navbar) {
    window.addEventListener("scroll", () => {
      const scrollY = window.scrollY;
      if (scrollY > 50) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    });
    console.log("Scroll event listener added for navbar");
  } else {
    console.error("Navbar not found");
  }
}

// Initialize navbar on `navbarLoaded` event
window.addEventListener("navbarLoaded", initializeNavbar);

// Fallback to DOMContentLoaded in case `navbarLoaded` event is missed
document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector(".navbar")) {
    initializeNavbar();
    updateAuthLink();
  }
});
