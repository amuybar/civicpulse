/*****************************************************************/
/*                     MAIN JAVASCRIPT                          */
/*****************************************************************/

/* ------------------------- HELPER FUNCTIONS ------------------------- */

/* Function to load HTML components (e.g., Navbar, Footer) */
function loadComponent(elementId, filePath) {
  return fetch(filePath)
    .then((response) => response.text())
    .then((data) => {
      document.getElementById(elementId).innerHTML = data;
    })
    .catch((error) => console.error(`Error loading ${filePath}:`, error));
}

/* Function to dynamically load JavaScript files */
function loadScript(filePath) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = filePath;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error(`Failed to load script ${filePath}`));
    document.head.appendChild(script);
  });
}

/* Function to handle route changes and load the correct page */
function router() {
  const app = document.getElementById("app");
  const hash = window.location.hash.substring(1) || "home"; 
  app.innerHTML = ""; 

  // Define routes
  const routes = {
    dashboard: {
      title: "Dashboard",
      filePath: "/pages/dashboard.html",
      scriptPath: "/js/dashboard.js",
      initFunction: "initializeDashboard",
    },
    budget: {
      title: "Budget",
      filePath: "/pages/budget.html",
      scriptPath: "/js/budget.js",
      initFunction: "initializeBudget",
    },
    auth: {
      title: "Join The Movement",
      filePath: "/pages/auth.html",
      scriptPath: "/js/auth.js",
      // initFunction: "initializeBudget",
    },
    projects: {
      title: "Projects",
      filePath: "/pages/projects.html",
      scriptPath: "/js/projects.js",
      initFunction: "initializeProjects",
    },
    home: {
      title: "Welcome To Civic Pulse",
      filePath: "/pages/dashboard.html",
      scriptPath: "/js/dashboard.js",
      initFunction: "initializeDashboard",
    },
  };
  // Default to 'home' if the hash is not recognized
  const route = routes[hash] || routes["home"];

  // Load HTML content for the route
  fetch(route.filePath)
    .then((response) => {
      if (!response.ok)
        throw new Error(
          `Error loading ${route.filePath}: ${response.statusText}`
        );
      return response.text();
    })
    .then((data) => {
      app.innerHTML = data;
      document.title = route.title;
      // Load the corresponding JS file
      return loadScript(route.scriptPath);
    })
    .then(() => {
      // Call the initialization function for the loaded page
      if (typeof window[route.initFunction] === "function") {
        // Dynamically call the init function
        window[route.initFunction]();
      }
    })
    .catch((error) => {
      console.error(error);
      app.innerHTML = "<h2>Error loading content</h2>";
    });
}

/* ------------------------ INITIALIZE APP ------------------------ */
function initializeApp() {
  // Load Navbar and Footer components
  loadComponent("navbar", "/components/navbar.html");
  loadComponent("footer", "/components/footer.html");

  // Initialize router and listen for URL hash changes
  window.addEventListener("hashchange", router);
  // Call router on initial load
  router();
}
 // Run initializeApp when DOM is loaded
document.addEventListener("DOMContentLoaded", initializeApp);
