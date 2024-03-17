interface Task {
  id: number;
  description: string;
  assignee_id?: string|null;
  assignee_first_name?: string;
  assignee_last_name?: string;
  assignee_username?: string;
  time_estimation: number;
  status: string;
}

interface CreateTaskData {
  description: string;
  assignee?: string;
  time_estimation: number;
}

export type { Task, CreateTaskData };
