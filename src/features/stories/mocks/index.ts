import { Story } from "../types";

export const Stories: Story[] = [
  {
    id: 1,
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
    id: 2,
    name: "Test story 2",
    description:
      "test story 2 description.\n Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea\n commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
    priority: "MUST_HAVE",
    businessValue: 3,
    pointEstimation: 5,
    status: "PRODUCT",
    acceptanceCriteria:
      "Everythning finnished and tested! Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
    rejectedComment: "",
  },
  {
    id: 3,
    name: "Test story 3",
    description: "test story 3 description",
    priority: "SHOULD_HAVE",
    businessValue: 2,
    pointEstimation: 3,
    status: "PRODUCT",
    acceptanceCriteria: "Tested",
    rejectedComment: "",
  },
];
