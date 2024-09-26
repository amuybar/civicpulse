/*****************************************************************/
/*                     TAB SWITCHING LOGIC                      */
/*****************************************************************/

// Check if tabBtns is already declared
if (typeof tabBtns === "undefined") {
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
}

/*****************************************************************/
/*                     AUTHENTICATION JAVASCRIPT                 */
/*****************************************************************/

/* Function to display error messages */
function displayErrorMessage(element, message) {
  console.error("Error Message Displayed:", message); // Log error message
  element.textContent = message;
  element.style.display = "block";
}

/* Function to hide error messages */
function hideErrorMessage(element) {
  element.textContent = "";
  element.style.display = "none";
}

/* Function to toggle loader visibility */
function toggleLoader(loaderId, show) {
  const loader = document.getElementById(loaderId);
  loader.style.display = show ? "block" : "none";
}

/* Function to validate email format */
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/* Function to handle form submission for Sign In */
function handleSignIn(event) {
  event.preventDefault();

  // Hide any previous error messages
  hideErrorMessage(document.getElementById("signin-email-error"));
  hideErrorMessage(document.getElementById("signin-password-error"));
  hideErrorMessage(document.getElementById("signin-general-error"));

  const email = document.getElementById("signin-email").value;
  const password = document.getElementById("signin-password").value;

  console.log("Sign In Email:", email); // Log email
  console.log("Sign In Password:", password); // Log password

  // Validate input
  if (!isValidEmail(email)) {
    displayErrorMessage(
      document.getElementById("signin-email-error"),
      "Please enter a valid email address."
    );
    return;
  }

  if (password.trim() === "") {
    displayErrorMessage(
      document.getElementById("signin-password-error"),
      "Password is required."
    );
    return;
  }

  // Prepare the data to send to the server
  const formData = {
    email: email,
    password: password,
  };

  // Show loader
  toggleLoader("signin-loader", true);

  // Send an API request to /api/user/login
  fetch("/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      localStorage.setItem("authToken", data.token);
      window.location.href = "#dashboard";
    })
    .catch((error) => {
      console.error("Error during sign-in:", error);
      displayErrorMessage(
        document.getElementById("signin-general-error"),
        "An error occurred during sign-in."
      );
    });
}

/* Function to handle form submission for Sign Up */
function handleSignUp(event) {
  event.preventDefault(); // Prevent default form submission

  // Hide any previous error messages
  hideErrorMessage(document.getElementById("signup-name-error"));
  hideErrorMessage(document.getElementById("signup-email-error"));
  hideErrorMessage(document.getElementById("signup-password-error"));
  hideErrorMessage(document.getElementById("signup-confirm-password-error"));
  hideErrorMessage(document.getElementById("signup-general-error"));

  const username = document.getElementById("signup-name").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  const confirmPassword = document.getElementById(
    "signup-confirm-password"
  ).value;

  console.log("Sign Up Username:", username); // Log username
  console.log("Sign Up Email:", email); // Log email
  console.log("Sign Up Password:", password); // Log password
  console.log("Confirm Password:", confirmPassword); // Log confirm password

  // Validate input
  if (username.trim() === "") {
    displayErrorMessage(
      document.getElementById("signup-name-error"),
      "Full name is required."
    );
    return;
  }

  if (!isValidEmail(email)) {
    displayErrorMessage(
      document.getElementById("signup-email-error"),
      "Please enter a valid email address."
    );
    return;
  }

  if (password !== confirmPassword) {
    displayErrorMessage(
      document.getElementById("signup-confirm-password-error"),
      "Passwords do not match."
    );
    return;
  }

  // Prepare the data to send to the server
  const formData = {
    username: username,
    email: email,
    password: password,
  };

  // Show loader
  toggleLoader("signup-loader", true);

  // Send an API request to /api/user/register
  fetch("/api/users/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => {
      console.log("Sign Up Response Status:", response.status); // Log response status
      return response.json();
    })
    .then((data) => {
      // Hide loader
      toggleLoader("signup-loader", false);

      console.log("Sign Up Response Data:", data); // Log response data

      if (data.success) {
        window.location.href = "/login";
      } else {
        displayErrorMessage(
          document.getElementById("signup-general-error"),
          `Registration failed: ${data.message}`
        );
      }
    })
    .catch((error) => {
      // Hide loader
      toggleLoader("signup-loader", false);
      console.error("Error during sign-up:", error);
      displayErrorMessage(
        document.getElementById("signup-general-error"),
        "An error occurred during sign-up."
      );
    });
}

/* Function to initialize the authentication page */
function initializeAuth() {
  console.log("Authentication page initialized");

  const signInForm = document.getElementById("signin-form");
  const signUpForm = document.getElementById("signup-form");

  // Add event listeners for form submissions
  if (signInForm) {
    signInForm.addEventListener("submit", handleSignIn);
  }

  if (signUpForm) {
    signUpForm.addEventListener("submit", handleSignUp);
  }
}

// Initialize the auth page when DOM is fully loaded
// document.addEventListener("DOMContentLoaded", initializeAuth);
