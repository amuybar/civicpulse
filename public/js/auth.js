const { response } = require("express");

// Tab switching logic
const tabBtns = document.querySelectorAll(".tab-btn");
const tabPanes = document.querySelectorAll(".tab-pane");

tabBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const tabId = btn.getAttribute("data-tab");

    // Update tabs
    tabBtns.forEach((b) => {
      b.classList.remove("active");
      b.setAttribute("aria-selected", "false");
    });
    tabPanes.forEach((p) => {
      p.classList.remove("active");
      p.setAttribute("aria-hidden", "true");
    });

    // Activate clicked tab
    btn.classList.add("active");
    btn.setAttribute("aria-selected", "true");
    document.getElementById(tabId).classList.add("active");
    document.getElementById(tabId).setAttribute("aria-hidden", "false");
  });
});

/*****************************************************************/
/*                     AUTHENTICATION JAVASCRIPT                 */
/*****************************************************************/

/* Function to validate email format */
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/* Function to handle form submission for Sign In */
function handleSignIn(event) {
  event.preventDefault(); 

  const email = document.getElementById("signin-email").value;
  const password = document.getElementById("signin-password").value;

  // Validate input
  if (!isValidEmail(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  // Prepare the data to send to the server
  const formData = {
    email: email,
    password: password,
  };

  // Send an API request to /api/user/login
  fetch("/api/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .then((data) => {
      if (response.ok) {
        alert("Sign In Successful!");
        window.location.href = "/dashboard";
        console.log(response)
      } else {
        alert(`Login Failed: ${data.message}`);
      }
    })
    .catch((error) => {
      console.error("Error during sign-in:", error);
      alert("An error occurred during sign-in.");
    });
}

/* Function to handle form submission for Sign Up */
function handleSignUp(event) {
  event.preventDefault(); // Prevent default form submission

  const username = document.getElementById("signup-name").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  const confirmPassword = document.getElementById(
    "signup-confirm-password"
  ).value;

  // Validate input
  if (!isValidEmail(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  // Prepare the data to send to the server
  const formData = {
    username: username,
    email: email,
    password: password,
  };

  // Send an API request to /api/user/register
  fetch("/api/user/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .then((data) => {
      if (response.ok) {
        alert("User registered successfully");
        window.location.href = "/login";
      } else {
        alert(`Registration failed: ${data.message}`);
      }
    })
    .catch((error) => {
      console.error("Error during sign-up:", error);
      alert("An error occurred during sign-up.");
    });
}

/* Function to initialize the authentication page */
function initializeAuth() {
  const signInForm = document.getElementById("signin-form");
  const signUpForm = document.getElementById("signup-form");

  // Add event listeners for form submissions
  signInForm.addEventListener("submit", handleSignIn);
  signUpForm.addEventListener("submit", handleSignUp);
}

// Initialize the auth page when DOM is fully loaded
document.addEventListener("DOMContentLoaded", initializeAuth);
