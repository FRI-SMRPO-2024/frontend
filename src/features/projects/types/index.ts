import { Component } from "vue";
import { AuthUser } from "@/features/auth";

interface CreateProjectData {
  name: string;
  description: string;
  productOwner: string;
  scrumMaster: string;
  developers: string[];
}

interface UserRole {
  id: number;
  user_id: string;
  project_id: number;
  roles: "OWNER" | "SCRUM_MASTER" | "DEVELOPER"[];
}

interface UserSelect {
  title: string;
  value: string;
}

interface Project {
  id: number;
  name: string;
  description: string;
  owner_id: string;
  created_at: string;
}

interface ProjectUser {
  user: AuthUser;
  roles: ("OWNER" | "DEVELOPER" | "SCRUM_MASTER")[];
}

interface UserProjects {
  project: Project;
  role: string;
}

interface ProjectTab {
  title: string;
  component: Component;
  props?: object;
}

export type {
  CreateProjectData,
  UserRole,
  UserSelect,
  Project,
  ProjectTab,
  ProjectUser,
  UserProjects,
};
