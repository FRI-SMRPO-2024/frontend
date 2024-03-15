interface LoginFormData {
  email: string;
  password: string;
}

interface AuthUser {
  id: number;

  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: "Admin" | "User";
}

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: AuthUser;
}

export type { LoginFormData, AuthUser, LoginResponse };
