import api from "./axios-helper";
import Cookies from "js-cookie";

// Register function
export async function register(username:string, password: string) {
  try {
    const response = await api.post("/auth/register", {
      username,
      password,
    });

    if (response.status === 200 || response.status === 201) {
      console.log("Registration successful:", response.data);
      return true; // Indicate success
    } else {
      console.error("Unexpected response:", response.data);
      return false;
    }
  } catch (error: any) {
    console.error("Registration failed:", error.response?.data || error.message);
    return false; // Indicate failure
  }
}

// Login function
export async function login(username: string, password: string) {
  try {
    const response = await api.post("/auth/login", {
      username,
      password,
    });

    if (response.status === 200 || response.status === 201) {
      console.log("Login successful:", response.data);

      // Set tokens/cookies
      Cookies.set("Authorization", response.data.token, { expires: 7 }); 
      Cookies.set("Session", response.data.session, { expires: 7 });
      Cookies.set("Username", response.data.username, { expires: 7 })

      return true; // Indicate success
    } else {
      console.error("Unexpected response:", response.data);
      return false;
    }
  } catch (error: any) {
    console.error("Login failed:", error.response?.data || error.message);
    return false; // Indicate failure
  }
}

export async function logout() {
  Cookies.remove("Authorization"); // Expires in 7 days
  Cookies.remove("Session");
  Cookies.remove("Username")
}
