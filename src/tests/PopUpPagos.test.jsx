import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PopupPagos from "../components/PopUpPagos";
import { vi } from "vitest";

// Mock de axios
vi.mock("axios", () => {
   return {
     default: {
       get: vi.fn((url) => {
         if (url.includes("/groups/123/members")) {
           return Promise.resolve({
             data: [
               { member_id: "1", user_id: "2", username: "Usuario2", mail: "usuario2@example.com" },
             ],
           });
         }
         return Promise.reject(new Error("Endpoint no reconocido"));
       }),
       post: vi.fn(() => Promise.resolve({ data: {} })), // Mock para POST
     },
   };
 });
 

// Mock de Auth0
vi.mock("@auth0/auth0-react", () => ({
  useAuth0: () => ({
    user: { email: "testuser@example.com" },
    isAuthenticated: true,
    getAccessTokenSilently: vi.fn(() => Promise.resolve("mockToken")),
  }),
}));

// Mock de alert
global.alert = vi.fn();

describe("PopupPagos", () => {
  const mockOnClose = vi.fn();

  const mockBalanceData = [
    { fromName: "testuser@example.com", toName: "Usuario2", amount: 5000 },
  ];

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("renderiza los elementos principales", () => {
    render(
      <PopupPagos
        onClose={mockOnClose}
        groupId="123"
        balanceData={mockBalanceData}
      />
    );

    expect(screen.getByText("Ingresar nuevo pago")).toBeInTheDocument();
    expect(screen.getByLabelText("Monto pagado")).toBeInTheDocument();
    expect(screen.getByLabelText("Pagar a:")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ingresar Pago" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cerrar" })).toBeInTheDocument();
  });

  test("valida campos obligatorios", async () => {
    render(
      <PopupPagos
        onClose={mockOnClose}
        groupId="123"
        balanceData={mockBalanceData}
      />
    );

    const submitButton = screen.getByRole("button", { name: "Ingresar Pago" });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith("Todos los campos son obligatorios");
    });
  });

  

  

  
});
