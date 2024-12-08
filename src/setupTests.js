import "@testing-library/jest-dom";
import { vi } from "vitest";

vi.mock("@auth0/auth0-react", () => ({
  useAuth0: () => ({
    user: { email: "testuser@example.com" },
    isAuthenticated: true,
    getAccessTokenSilently: vi.fn(() => Promise.resolve("mockToken")),
  }),
}));

global.alert = vi.fn();
