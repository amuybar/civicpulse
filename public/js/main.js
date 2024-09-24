// Function to load HTML components (e.g., navbar, footer)
function loadComponent(elementId, filePath) {
  fetch(filePath)
    .then((response) => response.text())
    .then((data) => {
      document.getElementById(elementId).innerHTML = data;
      if (elementId === "navbar") {
        // Dispatch a custom event when navbar is loaded
        window.dispatchEvent(new Event("navbarLoaded"));
      }
    })
    .catch((error) => console.error(`Error loading ${filePath}:`, error));
}

// Simple Router function to handle page navigation
function router() {
  const app = document.getElementById("app");
  const hash = window.location.hash.substring(1) || "home"; // Default to home if no hash
  app.innerHTML = "";

  const routes = {
    dashboard: {
      title: "Dashboard",
      content: "<h2>Dashboard</h2><p>Welcome to the dashboard!</p>",
    },
    budget: {
      title: "Budget",
      content:
        "<h2>Budget</h2><p>Budget information will be displayed here.</p>",
    },
    projects: {
      title: "Projects",
      content:
        "<h2>Projects</h2><p>Project information will be displayed here.</p>",
    },
    home: {
      title: "Welcome",
      content:
        "<h2>Welcome</h2><p>Select a section from the navigation menu.</p>",
    },
  };

  // Default to "home" if hash is not recognized
  const route = routes[hash] || routes["home"];

  // SET PAGE DETAILS
  app.innerHTML = route.content;
}

// Initialize application
function initializeApp() {
  loadComponent("navbar", "/components/navbar.html");
  loadComponent("footer", "/components/footer.html");

  // INITIAL ROUTER-  > LOADS THE ROUTER
  window.addEventListener("hashchange", router);
  router();
}

// RUN THE APP WHEN DOM IS LOADED
document.addEventListener("DOMContentLoaded", initializeApp);
