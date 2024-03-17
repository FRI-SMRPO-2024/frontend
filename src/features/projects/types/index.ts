import { Component } from "vue";
import { AuthUser } from "@/features/auth";

interface CreateProjectData {
  name: string;
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
  role: "OWNER" | "DEVELOPER" | "SCRUM_MASTER";
}

interface ProjectTab {
  title: string;
  component: Component;
  props?: object;
}

interface CreateSprintData {
  start_date: Date;
  end_data: Date;
  velocity: number;
  project_id: number;
}

interface Sprint {
  start_date: Date;
  end_date: Date;
  velocity: number;
}

export type {
  CreateProjectData,
  ProjectSelectedUsers,
  UserSelect,
  Project,
  ProjectTab,
  ProjectUser,
  CreateSprintData,
  Sprint,
};
