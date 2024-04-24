import { StoryTask } from "@/features/tasks/types";

interface CreateSprintData {
  start_date: Date;
  end_data: Date;
  velocity: number;
  project_id: number;
}

interface Sprint {
  id: number;
  start_date: string;
  end_date: string;
  velocity: number;
  created_at: string;
}

type TableSprints = {
  info: object;
  start_date: string;
  end_date: string;
  velocity: number;
};

interface SprintTasks {
  unassigned: StoryTask[];
  assigned: StoryTask[];
  completed: StoryTask[];
  active: StoryTask[];
}

export type { CreateSprintData, Sprint, TableSprints, SprintTasks };
