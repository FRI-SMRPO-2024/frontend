import { Project, Story } from "@/features/projects";

export const Stories: Story[] = [
  {
    name: "Test story 1",
    description: "test story 1 description",
    priority: "COULD_HAVE",
    businessValue: 1,
    pointEstimation: 2,
    status: "PRODUCT",
    acceptanceCriteria: "Everythning finnished",
    rejectedComment: "",
  },
  {
    name: "Test story 2",
    description: "test story 2 description",
    priority: "COULD_HAVE",
    businessValue: 3,
    pointEstimation: 5,
    status: "PRODUCT",
    acceptanceCriteria: "Everythning finnished and tested",
    rejectedComment: "",
  },
];

export const Projects: Project[] = [
  {
    id: 1,
    title: "SMRPO Group 2",
    description: "Lorem ipsum",
    users: [],
  },
  {
    id: 2,
    title: "SMRPO Group 1",
    description: "Lorem ipsum",
    users: [],
  },
  {
    id: 3,
    title: "SMRPO Group 5",
    description: "Lorem ipsum",
    users: [],
  },
  {
    id: 4,
    title: "SMRPO Group 4",
    description: "Lorem ipsum",
    users: [],
  },
];
