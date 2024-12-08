import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CreateGroupForm from "../components/CreateGroupForm";
import { vi } from "vitest";

// Mock de contactos
const mockContacts = [
  { username: "user1", mail: "user1@example.com" },
  { username: "user2", mail: "user2@example.com" },
];

vi.mock("axios", () => ({
  get: vi.fn(() =>
    Promise.resolve({
      data: mockContacts,
    })
  ),
}));


// Mock de alert
global.alert = vi.fn();

const mockOnGroupCreate = vi.fn();

describe("CreateGroupForm", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test("renders form elements", () => {
    render(<CreateGroupForm onGroupCreate={mockOnGroupCreate} gruposExistentes={[]} />);
    expect(screen.getByText("CREAR NUEVO GRUPO")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Nombre del Grupo (máximo 20 caracteres)")).toBeInTheDocument();
    expect(screen.getByText("Crear Grupo")).toBeInTheDocument();
  });

  test("validates empty group name", () => {
    render(<CreateGroupForm onGroupCreate={mockOnGroupCreate} gruposExistentes={[]} />);
    fireEvent.click(screen.getByText("Crear Grupo"));
    expect(global.alert).toHaveBeenCalledWith("Por favor, ingrese un nombre para el grupo.");
  });


  // test("removes a member from the list", async () => {
  //   render(<CreateGroupForm onGroupCreate={mockOnGroupCreate} gruposExistentes={[]} />);
  
  //   // Simula escribir en el input
  //   const contactInput = screen.getByPlaceholderText("Usuario / Mail Integrante");
  //   fireEvent.change(contactInput, { target: { value: "u" } });
  
  //   // Espera a que aparezca la sugerencia
  //   const suggestion = await screen.findByText("user1");
  //   fireEvent.click(suggestion);
  
  //   // Verifica que el miembro fue añadido
  //   const addedMember = screen.getByText("user1");
  //   expect(addedMember).toBeInTheDocument();
  
  //   // Encuentra y haz clic en el botón para remover al miembro
  //   const removeButton = screen.getByText("X");
  //   fireEvent.click(removeButton);
  
  //   // Verifica que el miembro fue eliminado
  //   expect(screen.queryByText("user1")).not.toBeInTheDocument();
  // });
  

  // test("adds a member from suggestions", async () => {
  //   render(<CreateGroupForm onGroupCreate={mockOnGroupCreate} gruposExistentes={[]} />);
  
  //   // Encuentra el input del miembro
  //   const contactInput = screen.getByPlaceholderText("Usuario / Mail Integrante");
  
  //   // Simula escribir en el input
  //   fireEvent.change(contactInput, { target: { value: "u" } });
  
  //   // Espera a que las sugerencias se rendericen
  //   const suggestion = await screen.findByText("user1");
    
  //   // Haz clic en la sugerencia
  //   fireEvent.click(suggestion);
  
  //   // Verifica que el miembro se añadió
  //   expect(screen.getByText("user1")).toBeInTheDocument();
  // });
  

  // test("creates a group successfully", async () => {
  //   render(<CreateGroupForm onGroupCreate={mockOnGroupCreate} gruposExistentes={[]} />);
  
  //   // Simula cambiar el nombre del grupo
  //   const groupNameInput = screen.getByPlaceholderText("Nombre del Grupo (máximo 20 caracteres)");
  //   fireEvent.change(groupNameInput, { target: { value: "NuevoGrupo" } });
  
  //   // Simula escribir en el input para añadir un miembro
  //   const contactInput = screen.getByPlaceholderText("Usuario / Mail Integrante");
  //   fireEvent.change(contactInput, { target: { value: "u" } });
  
  //   // Espera a que aparezca la sugerencia
  //   const suggestion = await screen.findByText("user1");
  //   fireEvent.click(suggestion);
  
  //   // Haz clic en el botón para crear el grupo
  //   const createGroupButton = screen.getByText("Crear Grupo");
  //   fireEvent.click(createGroupButton);
  
  //   // Verifica que se llamó al mock con los parámetros correctos
  //   expect(global.alert).toHaveBeenCalledWith("Grupo creado exitosamente.");
  //   expect(mockOnGroupCreate).toHaveBeenCalledWith({
  //     groupName: "NuevoGrupo",
  //     members: [{ username: "user1", mail: "user1@example.com" }],
  //   });
  // });
  
});
