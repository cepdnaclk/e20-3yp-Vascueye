import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { loginUser, signupUser, logoutUser } from "./authService";

const API_URL = "http://localhost:5000/api/auth";

describe("authService", () => {
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(axios);
    localStorage.clear(); // Clear localStorage before each test
  });

  afterEach(() => {
    mock.restore();
  });

  describe("loginUser", () => {
    it("should login hospital user and store email", async () => {
      const email = "hospital@example.com";
      const password = "password123";

      mock.onPost(`${API_URL}/signin`).reply(200, {
        success: true,
        role: "hospital",
        token: "abc123",
      });

      const response = await loginUser(email, password);

      expect(response.success).toBe(true);
      expect(localStorage.getItem("hospitalEmail")).toBe(email);
    });

    it("should not store email for non-hospital users", async () => {
      mock.onPost(`${API_URL}/signin`).reply(200, {
        success: true,
        role: "patient",
      });

      const response = await loginUser("user@example.com", "pass");

      expect(response.success).toBe(true);
      expect(localStorage.getItem("hospitalEmail")).toBeNull();
    });

    it("should handle login error", async () => {
      mock.onPost(`${API_URL}/signin`).reply(401, {
        message: "Invalid credentials",
      });

      const response = await loginUser("fail@example.com", "wrong");

      expect(response.success).toBe(false);
      expect(response.message).toBe("Invalid credentials");
    });
  });

  describe("signupUser", () => {
    it("should signup hospital user and store email", async () => {
      const email = "newhospital@example.com";
      const role = "hospital";

      mock.onPost(`${API_URL}/signup`).reply(200, {
        success: true,
      });

      const response = await signupUser("New Hospital", email, "secure", role);

      expect(response.success).toBe(true);
      expect(localStorage.getItem("hospitalEmail")).toBe(email);
    });

    it("should handle signup error", async () => {
      mock.onPost(`${API_URL}/signup`).reply(400, {
        message: "Email already exists",
      });

      const response = await signupUser("User", "taken@example.com", "pass", "hospital");

      expect(response.success).toBe(false);
      expect(response.message).toBe("Email already exists");
    });
  });

  describe("logoutUser", () => {
    it("should clear localStorage", () => {
      localStorage.setItem("token", "abc");
      localStorage.setItem("user", "John");
      localStorage.setItem("hospitalEmail", "hospital@example.com");

      logoutUser();

      expect(localStorage.getItem("token")).toBeNull();
      expect(localStorage.getItem("user")).toBeNull();
      expect(localStorage.getItem("hospitalEmail")).toBeNull();
    });
  });
});
