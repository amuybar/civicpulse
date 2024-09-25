// Sample Data for Budget Tracking
const budgetData = {
  total: 500000,
  spent: 300000,
  remaining: 200000,
};

// Sample Data for Projects
const projectData = [
  { name: "Road Construction", status: "In Progress", deadline: "2024-12-31" },
  {
    name: "Healthcare Improvement",
    status: "Completed",
    deadline: "2024-06-30",
  },
  {
    name: "Education Infrastructure",
    status: "In Progress",
    deadline: "2025-01-15",
  },
];

// Sample Data for Citizen Feedback
const feedbackData = [
  { citizen: "John Doe", message: "The healthcare project is very promising!" },
  {
    citizen: "Jane Smith",
    message: "We need more transparency in the education sector.",
  },
  {
    citizen: "Abdullah",
    message: "Corruption in the road project needs immediate attention.",
  },
];

// Function to render budget data
function renderBudgetData() {
  try {
    document.getElementById("total-budget").innerText = `$${budgetData.total}`;
    document.getElementById("spent-amount").innerText = `$${budgetData.spent}`;
    document.getElementById(
      "remaining-amount"
    ).innerText = `$${budgetData.remaining}`;
  } catch (error) {
    console.error("Error rendering budget data:", error);
  }
}

// Function to render projects list
function renderProjectList() {
  const projectList = document.getElementById("projects-list");
  projectList.innerHTML = ""; // Clear previous content
  projectData.forEach((project) => {
    const projectItem = document.createElement("div");
    projectItem.className = "project-item";
    projectItem.innerHTML = `<strong>${project.name}</strong> - Status: ${project.status}, Deadline: ${project.deadline}`;
    projectList.appendChild(projectItem);
  });
}

// Function to render citizen feedback
function renderCitizenFeedback() {
  const feedbackList = document.getElementById("feedback-list");
  feedbackList.innerHTML = ""; // Clear previous content
  feedbackData.forEach((feedback) => {
    const feedbackItem = document.createElement("div");
    feedbackItem.className = "feedback-item";
    feedbackItem.innerHTML = `<strong>${feedback.citizen}</strong>: ${feedback.message}`;
    feedbackList.appendChild(feedbackItem);
  });
}

// Initial rendering with loading indication
window.onload = async function () {
  const loadingMessage = document.createElement("div");
  loadingMessage.innerText = "Loading data...";
  loadingMessage.style.fontSize = "20px";
  document.body.appendChild(loadingMessage);

  // Simulate a delay for loading data (e.g., fetching data from an API)
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second

  // Render data
  try {
    renderBudgetData();
    renderProjectList();
    renderCitizenFeedback();
  } catch (error) {
    console.error("Error during initial rendering:", error);
  } finally {
    document.body.removeChild(loadingMessage); // Remove loading message
  }
};
