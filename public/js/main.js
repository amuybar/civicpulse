/*****************************************************************/
/*                     MAIN JAVASCRIPT                          */
/*****************************************************************/

/* 
   THIS SCRIPT INITIALIZES THE APPLICATION AND HANDLES DYNAMIC 
   LOADING OF HTML COMPONENTS AND JAVASCRIPT FILES FOR ROUTES. 
*/

/* ------------------------- INITIALIZE ALL COMPONENTS ------------------------- */

/* 
   FUNCTION TO LOAD HTML COMPONENTS (E.G., NAVBAR AND FOOTER)
   THIS FUNCTION FETCHES THE HTML FILE AND INSERTS IT INTO THE 
   SPECIFIED ELEMENT IN THE DOM.
*/
function loadComponent(elementId, filePath) {
  fetch(filePath)
    .then((response) => response.text())
    .then((data) => {
      document.getElementById(elementId).innerHTML = data;
      if (elementId === "navbar") {
        // DISPATCH A CUSTOM EVENT WHEN THE NAVBAR IS LOADED
        window.dispatchEvent(new Event("navbarLoaded"));
      }
    })
    .catch((error) => console.error(`Error loading ${filePath}:`, error));
}

/* 
   FUNCTION TO LOAD JAVASCRIPT FILES DYNAMICALLY
   THIS FUNCTION AVOIDS EXECUTING SOME JAVASCRIPT FILES 
   BEFORE THE MAIN JAVASCRIPT, ENSURING THEY LOAD IN THE 
   CORRECT ORDER.
*/
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

/* 
   ROUTER FUNCTION TO HANDLE DYNAMIC LOADING OF ROUTES
   THIS FUNCTION DETERMINES WHICH PAGE TO LOAD BASED ON THE 
   URL HASH AND FETCHES THE APPROPRIATE HTML AND SCRIPT.
*/
function router() {
  const app = document.getElementById("app");
  const hash = window.location.hash.substring(1) || "home"; // GET THE HASH FROM THE URL
  app.innerHTML = ""; // CLEAR PREVIOUS CONTENT

  // DEFINE ROUTES FOR THE APPLICATION
  const routes = {
    dashboard: {
      title: "Dashboard",
      filePath: "/pages/dashboard.html", // HTML FILE PATH
      scriptPath: "/js/dashboard.js", // JAVASCRIPT FILE PATH
    },
    budget: {
      title: "Budget",
      filePath: "/pages/budget.html",
    },
    projects: {
      title: "Projects",
      filePath: "/pages/projects.html",
    },
    home: {
      title: "Welcome",
      filePath: "/pages/home.html",
    },
  };

  // DEFAULT TO "home" IF THE HASH IS NOT RECOGNIZED
  const route = routes[hash] || routes["home"];

  // FETCH AND LOAD THE PAGE CONTENT FROM THE FILEPATH
  fetch(route.filePath)
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Error loading ${route.filePath}: ${response.statusText}`
        );
      }
      return response.text();
    })
    .then((data) => {
      // INSERT FETCHED HTML CONTENT INTO THE #app DIV
      app.innerHTML = data;
      document.title = route.title;

      // IF THE DASHBOARD IS LOADED, LOAD THE SCRIPT
      if (hash === "dashboard") {
        return loadScript(route.scriptPath);
      }
    })
    .then(() => {
      // CALL THE INITIALIZATION FUNCTIONS FOR THE DASHBOARD
      if (hash === "dashboard") {
        renderBudgetData();
        renderProjectList();
        renderCitizenFeedback();
      }
    })
    .catch((error) => {
      console.error(error);
      app.innerHTML =
        "<h2>Error loading page content</h2><p>Sorry, the content could not be loaded.</p>";
    });
}

/* ----------------------------------------------------------------- */
/*                       INITIALIZE THE APPLICATION                  */
/* ----------------------------------------------------------------- */
function initializeApp() {
  // LOAD NAVBAR AND FOOTER COMPONENTS
  loadComponent("navbar", "/components/navbar.html");
  loadComponent("footer", "/components/footer.html");

  // INITIALIZE ROUTER AND LISTEN FOR HASH CHANGES
  window.addEventListener("hashchange", router);
  router(); // CALL ONCE ON PAGE LOAD
}

// ------------------------ RUN THE APP WHEN DOM IS LOADED ------------------------
document.addEventListener("DOMContentLoaded", initializeApp);
