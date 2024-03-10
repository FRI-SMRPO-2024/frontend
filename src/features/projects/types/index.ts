import { User } from "@/features/users";
import { Component } from "vue";

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

interface ProjectTab {
  title: string;
  component: Component;
  props?: object;
}

interface Story {
  name: string;
  description: string;
  priority: string;
  businessValue: number;
  pointEstimation: number;
  status: string;
  acceptanceCriteria: string;
  rejectedComment: string;
}

interface CreateStoryData {
  name: string;
  description: string;
  priority: StoryPriority; //ENUM
  businessValue: number;
  pointEstimation: number;
  status: StoryStatus; //ENUM
  acceptanceCriteria: string;
  rejectedComment: string;
}

enum StoryPriority {
  NULL = 'NULL',
  COULD_HAVE = 'COULD_HAVE',
  SHOULD_HAVE = 'SHOULD_HAVE',
  MUST_HAVE = 'MUST_HAVE',
  WONT_HAVE_THIS_TIME = 'WONT_HAVE_THIS_TIME'
}

enum StoryStatus {
  PRODUCT = 'PRODUCT',
  SPRINT = 'SPRINT',
  DONE = 'DONE'
}

export type {
  CreateProjectData,
  ProjectSelectedUsers,
  UserSelect,
  Project,
  ProjectTab,
  Story,
  CreateStoryData,
};
