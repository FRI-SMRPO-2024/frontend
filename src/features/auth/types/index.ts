interface LoginFormData {
  email: string;
  password: string;
}

interface AuthUser {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  is_admin: boolean;
  last_login: string;
}

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: AuthUser;
}

export type { LoginFormData, AuthUser, LoginResponse };
