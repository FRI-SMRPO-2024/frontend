import { Component } from "vue";
import { User } from "@/features/users";

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
  scrumMaster: string;
  developers: string[];
}

interface ProjectUser {
  user: User;
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

interface Documentation {
  id: number;
  project_id: number;
  date: string;
  text: string;
}

interface ProjectWall {
  id: number;
  project_id: number;
  user: User;
  content: string;
  created_at: Date;
}

export type {
  CreateProjectData,
  UserRole,
  UserSelect,
  Project,
  ProjectTab,
  ProjectUser,
  UserProjects,
  Documentation,
  ProjectWall,
};
