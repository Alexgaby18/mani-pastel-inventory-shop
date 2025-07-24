import { LoginAuth } from "@/interfaces/auth.interface";

const API = "http://localhost:3000/auth";

export const login = async (auth: LoginAuth) => {
  try {
    const response = await fetch(`${API}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: auth.email,
        password: auth.password
      }),
    });

    if (!response.ok) {
      throw new Error('Credenciales incorrectas');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
}