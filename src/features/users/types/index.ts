type User = {
  id: number;
  username: string;
  fullname: string;
  email: string;
  role: string;
};

interface CreateUserData {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  email: string;
  role: "user" | "admin";
}

export type { User, CreateUserData };
