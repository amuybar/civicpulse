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
  event.preventDefault(); // Prevent default form submission

  const email = document.getElementById("signin-email").value;
  const password = document.getElementById("signin-password").value;

  // Validate input
  if (!isValidEmail(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  // Simulate an API call for sign-in (replace with your actual API call)
  console.log("Signing in with:", { email, password });
  // Add your sign-in logic here (e.g., API request)

  alert("Sign In Successful!"); // Replace this with your actual logic
}

/* Function to handle form submission for Sign Up */
function handleSignUp(event) {
  event.preventDefault(); // Prevent default form submission

  const name = document.getElementById("signup-name").value;
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

  // Simulate an API call for sign-up (replace with your actual API call)
  console.log("Signing up with:", { name, email, password });
  // Add your sign-up logic here (e.g., API request)

  alert("Sign Up Successful!"); // Replace this with your actual logic
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
