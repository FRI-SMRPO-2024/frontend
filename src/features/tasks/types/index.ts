import { AuthUser } from "@/features/auth";

interface Task {
  id: number;
  description: string;
  assignee_id?: string | null;
  assignee_first_name?: string;
  assignee_last_name?: string;
  assignee_username?: string;
  time_estimation: number;
  status: string;
}

interface StoryTask {
  task: Task;
  time_logs: TimeLog[];
  assignee: AuthUser;
}

interface CreateTaskData {
  description: string;
  assignee?: string;
  time_estimation: number;
}

interface TaskWithAssigneeTimeLogInfo {
  task: Task;
  time_logs: TimeLog[];
  assignee: AuthUser | null;
}

interface TimeLog {
  id: number;
  task_id: number;
  user_id: string;
  date: string;
  time_from: string;
  time_to: string;
  estimated_time_left: number;
  description: string;
  created_at: string;
}

interface TimeLogCreate {
  task_id: number;
  user_id: string;
  date: string;
  time_from: string;
  time_to: string;
  estimated_time_left: number;
  description: string;
}

interface TimeLogUpdate {
  task_id: number;
  user_id: string;
  date: string;
  time_from: string;
  time_to: string;
  estimated_time_left: number;
  description: string;
}

export type {
  Task,
  CreateTaskData,
  StoryTask,
  TimeLog,
  TimeLogCreate,
  TimeLogUpdate,
  TaskWithAssigneeTimeLogInfo,
};
