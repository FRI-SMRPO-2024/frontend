type User = {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  is_admin: true;
  created_at: string;
  last_login: string;
};

interface CreateUserData {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  email: string;
  role: "user" | "admin";
}

type TableUser = {
  email: string;
  username: string;
  fullName: string;
  role: "Admin" | "User";
  createdOn: string;
  lastLogin: string;
};

export type { User, CreateUserData, TableUser };
