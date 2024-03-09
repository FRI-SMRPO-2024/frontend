import { User } from "@/features/users";

interface CreateProjectData {
  title: string;
  description: string;
  productOwner: string;
  scrumMaster: string;
  developers: string[];
}

interface ProjectSelectedUsers {
  productOwner: number;
  scrumMaster: number;
  developers: number[];
}

interface UserSelect {
  title: string;
  value: number;
}

interface Project {
  id: number;
  title: string;
  description: string;
  users: User[];
}

export type { CreateProjectData, ProjectSelectedUsers, UserSelect, Project };
