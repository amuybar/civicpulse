// Utility function to fetch data
async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Network response was not ok for ${url}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`There has been a problem with fetching ${url}:`, error);
    return null;
  }
}

// Function to render data to the DOM
function renderData(elementId, data, renderFunction) {
  const element = document.getElementById(elementId);
  if (element && data) {
    element.innerHTML = ""; // Clear previous content
    renderFunction(element, data);
  }
}

// Render functions for different data types
const renderFunctions = {
  budget: (element, data) => {
    element.innerHTML = `
      <p>Total Budget: $${data.total}</p>
      <p>Spent: $${data.spent}</p>
      <p>Remaining: $${data.remaining}</p>
    `;
  },
  projects: (element, data) => {
    if (Array.isArray(data)) {
      data.forEach((project) => {
        const projectItem = document.createElement("div");
        projectItem.className = "project-item";
        projectItem.innerHTML = `<strong>${project.name}</strong> - Status: ${project.status}, Deadline: ${project.deadline}`;
        element.appendChild(projectItem);
      });
    } else {
      console.error("Projects data is not an array:", data);
    }
  },
  feedback: (element, data) => {
    if (Array.isArray(data)) {
      data.forEach((feedback) => {
        const feedbackItem = document.createElement("div");
        feedbackItem.className = "feedback-item";
        feedbackItem.innerHTML = `<strong>${feedback.citizen}</strong>: ${feedback.message}`;
        element.appendChild(feedbackItem);
      });
    } else {
      console.error("Feedback data is not an array:", data);
    }
  },
  civicEducation: (element, data) => {
    // Check if data is an object with a civic_education property
    const educationItems = data.civic_education || data;
    if (Array.isArray(educationItems)) {
      educationItems.forEach((item) => {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("awareness-item");
        itemDiv.innerHTML = `
          <h3>${item.heading}</h3>
          <p>${item.summary}</p>
        `;
        element.appendChild(itemDiv);
      });
    } else {
      console.error(
        "Civic education data is not in the expected format:",
        data
      );
    }
  },
};

// Map rendering logic
let map, geojsonLayer;

// Updated renderMap function
function renderMap() {
  // Check if the map container exists
  const mapContainer = document.getElementById("map");
  if (!mapContainer) {
    console.error(
      "Map container element not found. Make sure you have a div with id 'map' in your HTML."
    );
    return;
  }

  // Check if Leaflet is loaded
  if (typeof L === "undefined") {
    console.error(
      "Leaflet library is not loaded. Make sure you've included the Leaflet CSS and JS files."
    );
    return;
  }

  // Initialize the map with Kenya's approximate bounding box
  map = L.map("map", {
    center: [0.0236, 37.9062], // Center of Kenya
    zoom: 6,
    minZoom: 6,
    maxZoom: 6,
    zoomControl: false, // Disable zoom control
    dragging: false, // Disable map dragging
    touchZoom: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    boxZoom: false,
    tap: false,
  });

  // Set max bounds to restrict panning
  const southWest = L.latLng(-4.8, 33.9);
  const northEast = L.latLng(5.0, 41.9);
  const bounds = L.latLngBounds(southWest, northEast);
  map.setMaxBounds(bounds);

  // Add OpenStreetMap tile layer
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Load GeoJSON data
  fetch("./geojson/kenyan-counties.geojson")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (!data.features || !Array.isArray(data.features)) {
        throw new Error("GeoJSON data is not in the expected format");
      }

      // Add GeoJSON layer
      geojsonLayer = L.geoJson(data, {
        style: styleCounty,
        onEachFeature: onEachFeature,
      }).addTo(map);

      // Fit the map to the GeoJSON layer bounds
      map.fitBounds(geojsonLayer.getBounds());
    })
    .catch((error) => {
      console.error("Error loading or processing GeoJSON data:", error);
      mapContainer.innerHTML = `<p>Error loading map data: ${error.message}</p>`;
    });
}

// Function to handle interactions for each feature (county)
function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: zoomToFeature,
  });
}

// Function to highlight a county on mouseover
function highlightFeature(e) {
  var layer = e.target;

  layer.setStyle({
    weight: 5,
    color: "#666",
    dashArray: "",
    fillOpacity: 0.7,
  });

  layer.bringToFront();
  updateInfoBox(layer.feature.properties);
}

// Function to reset highlight on mouseout
function resetHighlight(e) {
  geojsonLayer.resetStyle(e.target);
  clearInfoBox();
}

// Function to handle county click
function zoomToFeature(e) {
  updateInfoBox(e.target.feature.properties);
}

// Function to update info box with county data
function updateInfoBox(props) {
  const infoBox = document.getElementById("county-info");
  if (infoBox) {
    infoBox.innerHTML = `<h4>${props.COUNTY}</h4>
                         <p>Corruption Index: ${
                           countyData[props.COUNTY] || "N/A"
                         }</p>`;
  }
}

// Function to clear info box
function clearInfoBox() {
  const infoBox = document.getElementById("county-info");
  if (infoBox) {
    infoBox.innerHTML = "<h4>Hover over a county</h4>";
  }
}



// Main function to initialize dashboard
async function initializeDashboard() {
  const dataTypes = [
    {
      url: "./models/budget.json",
      elementId: "budget-data",
      renderer: "budget",
    },
    {
      url: "./models/projects.json",
      elementId: "projects-list",
      renderer: "projects",
    },
    {
      url: "./models/feedback.json",
      elementId: "feedback-list",
      renderer: "feedback",
    },
    {
      url: "./models/civic_edu.json",
      elementId: "awareness-list",
      renderer: "civicEducation",
    },
  ];

  const loadingMessage = document.createElement("div");
  loadingMessage.innerText = "Loading data...";
  loadingMessage.style.fontSize = "20px";
  document.body.appendChild(loadingMessage);

  try {
    for (const dataType of dataTypes) {
      const data = await fetchData(dataType.url);
      renderData(dataType.elementId, data, renderFunctions[dataType.renderer]);
    }

    // Create info box for county data
    const infoBox = document.createElement("div");
    infoBox.id = "county-info";
    infoBox.className = "info";
    infoBox.innerHTML = "<h4>Hover over a county</h4>";
    document.getElementById("map").appendChild(infoBox);

    // Initialize map
    renderMap();
  } catch (error) {
    console.error("Error during dashboard initialization:", error);
  } finally {
    document.body.removeChild(loadingMessage);
  }
}

// Sample data for each county (you might want to load this dynamically)
// List of all 47 counties in Kenya
const counties = [
    "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Garissa", 
    "Kilifi", "Machakos", "Eldoret", "Nyeri", "Kakamega", 
    "Baringo", "Kiambu", "Vihiga", "Mandera", "Narok", 
    "Marsabit", "Wajir", "Makueni", "Embu", "Meru",
    "Nandi", "Uasin Gishu", "Bomet", "Kericho", "Nyamira",
    "Migori", "Homa Bay", "Siaya", "Busia", "Trans Nzoia",
    "West Pokot", "Samburu", "Laikipia", "Isiolo", 
    "Tharaka Nithi", "Kitui", "Machakos", 
    "Kajiado", "Narok", "Taita Taveta",
    "Lamu", "Kilifi", 
    // Add any additional counties as necessary
];

// Function to generate random data for each county
function generateRandomCountyData() {
    const countyData = {};
    
    counties.forEach(county => {
        // Generate a random integer between 30 and 100
        const randomValue = Math.floor(Math.random() * (100 - 30 + 1)) + 30;
        countyData[county] = randomValue;
    });

    return countyData;
}
 const countyData = generateRandomCountyData();


// Function to get color based on county value
function getColor(value) {
    return value > 80
        ? "#800026"
        : value > 70
        ? "#BD0026"
        : value > 60
        ? "#E31A1C"
        : value > 50
        ? "#FC4E2A"
        : value > 40
        ? "#FD8D3C"
        : value > 30
        ? "#FEB24C"
        : value > 20
        ? "#FED976"
        : "#FFEDA0";
}


// Function to style each county based on its data value
function styleCounty(feature) {
  const countyName = feature.properties.COUNTY;
  const value = countyData[countyName] || 0; // Get data for the county or 0 if undefined
  return {
    fillColor: getColor(value),
    weight: 2,
    opacity: 1,
    color: "white",
    dashArray: "3",
    fillOpacity: 0.7,
  };
}

// Event listener for DOMContentLoaded
document.addEventListener("DOMContentLoaded", initializeDashboard);
