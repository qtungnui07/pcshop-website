import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useAuth as useClerkAuth, useUser as useClerkUser, useSignIn } from "@clerk/clerk-react";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  avatar: string;
  provider: "local" | "google";
  phone?: string;
  address?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  updateProfile: (updatedData: { name: string; phone?: string; address?: string; avatar?: string; newPassword?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PORT = 3001;
export const API_BASE = typeof window !== "undefined"
  ? (window.location.hostname.includes("qtitpc.dev")
    ? "https://api-pc.qtitpc.dev"
    : `${window.location.protocol}//${window.location.hostname}:${PORT}`)
  : `http://localhost:${PORT}`;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Clerk hooks
  const { isLoaded: isClerkLoaded, isSignedIn: isClerkSignedIn, user: clerkUser } = useClerkUser();
  const { signOut: clerkSignOut } = useClerkAuth();
  const { signIn: clerkSignIn } = useSignIn();

  // Load local user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("pcshop_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse saved user", e);
        localStorage.removeItem("pcshop_user");
      }
    }
  }, []);

  // Update loading state once Clerk has loaded
  useEffect(() => {
    if (isClerkLoaded) {
      setLoading(false);
    }
  }, [isClerkLoaded]);

  // Synchronize Clerk user state with our database
  useEffect(() => {
    if (isClerkLoaded && isClerkSignedIn && clerkUser) {
      const syncUser = async () => {
        const email = clerkUser.primaryEmailAddress?.emailAddress;
        const name = clerkUser.fullName || clerkUser.firstName || "Google User";
        const avatar = clerkUser.imageUrl;
        
        if (email) {
          try {
            const res = await fetch(`${API_BASE}/api/auth/google-login`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, name, avatar })
            });
            const data = await res.json();
            if (res.ok && data.user) {
              setUser(data.user);
              localStorage.setItem("pcshop_user", JSON.stringify(data.user));
            }
          } catch (err) {
            console.error("Failed to sync Clerk session with backend database", err);
          }
        }
      };
      syncUser();
    } else if (isClerkLoaded && !isClerkSignedIn && user?.provider === "google") {
      // If Clerk is signed out but local user is still Google, clear local session
      setUser(null);
      localStorage.removeItem("pcshop_user");
    }
  }, [isClerkLoaded, isClerkSignedIn, clerkUser]);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || "Đăng nhập thất bại" };
      }
      setUser(data.user);
      localStorage.setItem("pcshop_user", JSON.stringify(data.user));
      return { success: true };
    } catch (err) {
      return { success: false, error: "Không thể kết nối đến máy chủ" };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || "Đăng ký thất bại" };
      }
      setUser(data.user);
      localStorage.setItem("pcshop_user", JSON.stringify(data.user));
      return { success: true };
    } catch (err) {
      return { success: false, error: "Không thể kết nối đến máy chủ" };
    }
  };

  const loginWithGoogle = async () => {
    if (!clerkSignIn) {
      return { success: false, error: "Dịch vụ Clerk chưa sẵn sàng." };
    }
    try {
      await clerkSignIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/"
      });
      return { success: true };
    } catch (err: any) {
      console.error("Clerk OAuth redirect error:", err);
      return { success: false, error: err.message || "Đăng nhập Google thất bại" };
    }
  };

  const updateProfile = async (updatedData: { name: string; phone?: string; address?: string; avatar?: string; newPassword?: string }) => {
    if (!user) return { success: false, error: "Chưa đăng nhập" };
    try {
      const res = await fetch(`${API_BASE}/api/auth/update-profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, ...updatedData })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || "Không thể cập nhật thông tin" };
      }
      setUser(data.user);
      localStorage.setItem("pcshop_user", JSON.stringify(data.user));
      return { success: true };
    } catch (err) {
      return { success: false, error: "Không thể kết nối đến máy chủ" };
    }
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem("pcshop_user");
    try {
      if (isClerkSignedIn) {
        await clerkSignOut();
      }
    } catch (e) {
      console.error("Failed to sign out from Clerk:", e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginWithGoogle, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
