import { createContext, useContext, useEffect, useState } from "react";
import * as authService from "../services/auth";
import * as profileService from "../services/profiles";

const AuthContext = createContext(null);

// Traduce los mensajes de error de Supabase Auth a mensajes claros para el usuario.
const LOGIN_ERROR_MESSAGES = {
  "Invalid login credentials": "Email o contraseña incorrectos.",
  "Email not confirmed": "Debes confirmar tu email antes de iniciar sesión. Revisa tu bandeja de entrada.",
  "Email y contraseña son obligatorios.": "Email y contraseña son obligatorios.",
  "Too many requests": "Demasiados intentos. Espera unos minutos y vuelve a intentarlo.",
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar sesión inicial y suscribirse a cambios
  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        const sessionUser = await authService.getCurrentUser();
        if (!mounted) return;

        setUser(sessionUser);

        if (sessionUser) {
          const p = await profileService.ensureProfile(sessionUser);
          if (mounted) setProfile(p);
        }
      } catch (err) {
        console.error("Error inicializando sesión:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    init();

    const unsubscribe = authService.onAuthStateChange(async (newUser) => {
      setUser(newUser);
      if (newUser) {
        try {
          const p = await profileService.ensureProfile(newUser);
          setProfile(p);
        } catch (err) {
          console.error("Error cargando perfil:", err);
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const register = async ({ name, email, password }) => {
    try {
      await authService.signUp({
        email,
        password,
        displayName: name,
      });
      return { ok: true };
    } catch (err) {
      const message = err.isNetworkError
        ? err.message
        : err.message === "User already registered"
        ? "Ya existe una cuenta con ese email."
        : err.message || "Error al crear la cuenta. Inténtalo de nuevo.";
      return { ok: false, error: message };
    }
  };

  const login = async ({ email, password }) => {
    try {
      await authService.signIn({ email, password });
      return { ok: true };
    } catch (err) {
      if (err.isNetworkError) {
        return { ok: false, error: err.message, invalidCredentials: false };
      }

      const invalidCredentials = err.message === "Invalid login credentials";
      const message = LOGIN_ERROR_MESSAGES[err.message] || err.message || "Error al iniciar sesión. Inténtalo de nuevo.";
      return { ok: false, error: message, invalidCredentials };
    }
  };

  const logout = async () => {
    try {
      await authService.signOut();
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
  };

  const refreshProfile = async () => {
    if (!user) return;
    try {
      const p = await profileService.getProfile(user.id);
      setProfile(p);
    } catch (err) {
      console.error("Error refrescando perfil:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, register, login, logout, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return context;
}
