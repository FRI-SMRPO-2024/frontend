interface Story {
  id: number;
  name: string;
  description: string;
  priority: string;
  business_value: number;
  point_estimation: number;
  status: string;
  acceptance_criteria: string;
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

export type { Story, CreateStoryData, StoryStatus, StoryPriority };
