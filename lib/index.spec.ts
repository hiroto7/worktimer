import { calculateTaskTimes, TaskEvent } from ".";

const generateCaseName = (activities: readonly TaskEvent[]) =>
  `[${activities.map(({ task, type }) => `${task}.${type}`).join(", ")}]`;

test("generateCaseName", () => {
  const activities: readonly TaskEvent[] = [
    { task: "t1", time: 2, type: "resume" },
    { task: "t1", time: 3, type: "pause" },
    { task: "t2", time: 5, type: "resume" },
  ];
  expect(generateCaseName(activities)).toBe("[t1.resume, t1.pause, t2.resume]");
});

describe("calculateTaskTimes", () => {
  const cases: readonly [
    readonly TaskEvent[],
    { readonly [task: string]: number }
  ][] = [
    [[], {}],
    [[{ task: "t1", time: 2, type: "resume" }], { t1: 98 }],
    [
      [
        { task: "t1", time: 2, type: "resume" },
        { task: "t1", time: 3, type: "pause" },
      ],
      { t1: 1 },
    ],
    [
      [
        { task: "t1", time: 2, type: "resume" },
        { task: "t1", time: 3, type: "pause" },
        { task: "t2", time: 5, type: "resume" },
      ],
      { t1: 1, t2: 95 },
    ],
    [
      [
        { task: "t1", time: 2, type: "resume" },
        { task: "t1", time: 3, type: "pause" },
        { task: "t2", time: 5, type: "resume" },
        { task: "t2", time: 7, type: "pause" },
      ],
      { t1: 1, t2: 2 },
    ],
    [
      [
        { task: "t1", time: 3, type: "resume" },
        { task: "t2", time: 5, type: "resume" },
      ],
      { t1: 49.5, t2: 47.5 },
    ],
    [
      [
        { task: "t1", time: 3, type: "resume" },
        { task: "t2", time: 5, type: "resume" },
        { task: "t1", time: 7, type: "pause" },
      ],
      { t1: 3, t2: 94 },
    ],
    [
      [
        { task: "t1", time: 3, type: "resume" },
        { task: "t2", time: 5, type: "resume" },
        { task: "t2", time: 7, type: "pause" },
      ],
      { t1: 96, t2: 1 },
    ],
  ];

  test.each(
    cases.map(([activities, expected]) => ({
      activities,
      expected: new Map(Object.entries(expected)),
      name: generateCaseName(activities),
    }))
  )("$name", ({ activities, expected }) =>
    expect(calculateTaskTimes(activities, 100)).toEqual(expected)
  );
});
