import { MockUser } from "../types";

export const mockUsers: MockUser[] = [
  {
    id: 1,
    description: "A new user that has no todos yet.",
    name: "Cory",
    todos: [],
  },
  {
    id: 1,
    description: "A user with a few todos.",
    name: "Tom",
    todos: [
      {
        id: 1,
        todo: "Eat chili",
        completed: false,
      },
    ],
  },
  {
    id: 1,
    description: "A power user with many todos.",
    name: "Elon",
    todos: [
      {
        id: 1,
        todo: "Ship Model S",
        completed: true,
      },
      {
        id: 2,
        todo: "Ship Model 3",
        completed: true,
      },
      {
        id: 3,
        todo: "Ship Model X",
        completed: true,
      },
      {
        id: 4,
        todo: "Ship Cybertruck",
        completed: false,
      },
      {
        id: 5,
        todo: "Ship Semi",
        completed: false,
      },
    ],
  },
];
