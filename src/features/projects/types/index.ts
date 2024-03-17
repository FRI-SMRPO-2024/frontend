import { Component } from "vue";

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

interface ProjectTab {
  title: string;
  component: Component;
  props?: object;
}

interface Story {
  id: number;
  name: string;
  description: string;
  priority: string;
  businessValue: number;
  pointEstimation: number;
  timeEstimation?: number;
  status: string;
  acceptanceCriteria: string;
  rejectedComment: string;
}

interface CreateStoryData {
  name: string;
  description: string;
  priority: StoryPriority; //ENUM
  business_value: number;
  point_estimation: number;
  status: StoryStatus; //ENUM
  acceptance_criteria: string;
  rejected_comment: string;
}

enum StoryPriority {
  NULL = "NULL",
  COULD_HAVE = "COULD_HAVE",
  SHOULD_HAVE = "SHOULD_HAVE",
  MUST_HAVE = "MUST_HAVE",
  WONT_HAVE_THIS_TIME = "WONT_HAVE_THIS_TIME",
}

enum StoryStatus {
  PRODUCT = "PRODUCT",
  SPRINT = "SPRINT",
  DONE = "DONE",
}

interface CreateSprintData {
  start_date: Date;
  end_data: Date;
  velocity: number;
  project_id: number;
}

interface Sprint {
  start_date: Date;
  end_data: Date;
  velocity: number;
}

export type {
  CreateProjectData,
  ProjectSelectedUsers,
  UserSelect,
  Project,
  ProjectTab,
  Story,
  CreateStoryData,
  CreateSprintData,
  Sprint,
};
