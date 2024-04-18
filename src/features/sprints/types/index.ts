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

export type { CreateSprintData, Sprint, TableSprints };
