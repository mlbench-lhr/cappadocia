import api from "@/lib/api/axios-config";

export interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export const signUp = async (userData: SignUpData) => {
  try {
    const response = await api.post("/api/auth/signup", userData);

    // Set auth cookie
    if (response.data.token) {
      document.cookie = `auth_token=${response.data.token}; path=/; max-age=${
        7 * 24 * 60 * 60
      }; secure; samesite=strict`;
    }

    return { data: response.data, error: null };
  } catch (error: any) {
    return {
      data: null,
      error: {
        message:
          error.response?.data?.error || error.message || "Sign up failed",
      },
    };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const response = await api.post("/api/auth/signin", { email, password });

    // Set auth cookie
    if (response.data.token) {
      document.cookie = `auth_token=${response.data.token}; path=/; max-age=${
        7 * 24 * 60 * 60
      }; secure; samesite=strict`;
    }

    return { data: response.data, error: null };
  } catch (error: any) {
    return {
      data: null,
      error: {
        message:
          error.response?.data?.error || error.message || "Sign in failed",
      },
    };
  }
};

export const signInWithGoogle = async () => {
  try {
    // Redirect to Google OAuth endpoint
    window.location.href = "/api/auth/google";
    return { error: null };
  } catch (error: any) {
    return {
      error: { message: error.message || "Google sign in failed" },
    };
  }
};

export const signOut = async () => {
  try {
    await api.post("/api/auth/signout");

    // Clear auth cookie
    document.cookie =
      "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    return { error: null };
  } catch (error: any) {
    // Still clear cookie even if server call fails
    document.cookie =
      "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    return {
      error: {
        message:
          error.response?.data?.error || error.message || "Sign out failed",
      },
    };
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const response = await api.post("/api/auth/forgot-password", { email });
    return { data: response.data, error: null };
  } catch (error: any) {
    return {
      data: null,
      error: {
        message:
          error.response?.data?.error ||
          error.message ||
          "Failed to send reset email",
      },
    };
  }
};

export const updatePassword = async (token: string, password: string) => {
  try {
    const response = await api.post("/api/auth/reset-password", {
      token,
      password,
    });
    return { data: response.data, error: null };
  } catch (error: any) {
    return {
      data: null,
      error: {
        message:
          error.response?.data?.error ||
          error.message ||
          "Failed to update password",
      },
    };
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get("/api/auth/me");
    return { data: response.data, error: null };
  } catch (error: any) {
    return {
      data: null,
      error: {
        message:
          error.response?.data?.error || error.message || "Failed to get user",
      },
    };
  }
};
