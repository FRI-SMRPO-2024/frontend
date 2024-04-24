type User = {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  is_admin: true;
  created_at: string;
  last_login: string;
  last_login_array: string[];
};

interface CreateUserData {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  email: string;
  role: "User" | "Admin";
}

interface UpdateUserData {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  role: "User" | "Admin";
}

type TableUser = {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: "Admin" | "User";
  createdOn: string;
};

export type { User, CreateUserData, UpdateUserData, TableUser };
