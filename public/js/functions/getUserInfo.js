let userData = null; // Global variable to store user data

function getUserInfo() {
  const token = localStorage.getItem("authToken");

  if (!token) {
    console.error("No token found, user is not authenticated.");
    window.location.href = "#auth"; // Redirect to authentication page
    return; // Early exit to prevent further execution
  }

  fetch("/api/users/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      userData = data; // Store user info in global variable
      console.log("User Info:", userData); // Log user info
      // Optionally, you could update the UI with the user data here
      updateProfileUI(userData);
    })
    .catch((error) => {
      console.error("Error fetching user info:", error);
      // Handle the error scenario, maybe redirect to auth page or show a message
      window.location.href = "#auth"; // Redirect to auth if fetch fails
    });
}
