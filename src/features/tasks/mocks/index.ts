import { Task } from "@/features/tasks/types";
import { usersData } from "@/features/users";

export const tasksData: Task[] = [
  {
    id: 1,
    description: "Test task 1",
    assignee: usersData[0],
    status: "assigned",
  },
  {
    id: 1,
    description: "Test task 2",
    assignee: usersData[1],
    status: "assigned",
  },
  {
    id: 1,
    description: "Test task 3 for now",
    status: "assigned",
  },
];
