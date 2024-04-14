import { Task } from "@/features/tasks/types";

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
  start_date: string;
  end_date: string;
  velocity: number;
};

interface SprintTasks {
  unassigned: Task[];
  assigned: Task[];
  completed: Task[];
  active: Task[];
}

export type { CreateSprintData, Sprint, TableSprints, SprintTasks };
