import { analyzeTaskEventSequence, TaskEvent } from ".";

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

describe("analyzeTaskEventSequence", () => {
  const cases: readonly [
    readonly TaskEvent[],
    { readonly [task: string]: number },
    readonly string[]
  ][] = [
    [[], {}, []],
    [[{ task: "t1", time: 2, type: "resume" }], {}, ["t1"]],
    [
      [
        { task: "t1", time: 2, type: "resume" },
        { task: "t1", time: 3, type: "pause" },
      ],
      { t1: 1 },
      [],
    ],
    [
      [
        { task: "t1", time: 2, type: "resume" },
        { task: "t1", time: 3, type: "pause" },
        { task: "t1", time: 5, type: "resume" },
      ],
      { t1: 1 },
      ["t1"],
    ],
    [
      [
        { task: "t1", time: 2, type: "resume" },
        { task: "t1", time: 3, type: "pause" },
        { task: "t1", time: 5, type: "resume" },
        { task: "t1", time: 7, type: "pause" },
      ],
      { t1: 3 },
      [],
    ],
    [
      [
        { task: "t1", time: 2, type: "resume" },
        { task: "t1", time: 3, type: "pause" },
        { task: "t2", time: 5, type: "resume" },
      ],
      { t1: 1 },
      ["t2"],
    ],
    [
      [
        { task: "t1", time: 2, type: "resume" },
        { task: "t1", time: 3, type: "pause" },
        { task: "t2", time: 5, type: "resume" },
        { task: "t2", time: 7, type: "pause" },
      ],
      { t1: 1, t2: 2 },
      [],
    ],
    [
      [
        { task: "t1", time: 3, type: "resume" },
        { task: "t2", time: 5, type: "resume" },
      ],
      { t1: 2 },
      ["t1", "t2"],
    ],
    [
      [
        { task: "t1", time: 3, type: "resume" },
        { task: "t2", time: 5, type: "resume" },
        { task: "t1", time: 7, type: "pause" },
      ],
      { t1: 3, t2: 1 },
      ["t2"],
    ],
    [
      [
        { task: "t1", time: 3, type: "resume" },
        { task: "t2", time: 5, type: "resume" },
        { task: "t2", time: 7, type: "pause" },
      ],
      { t1: 3, t2: 1 },
      ["t1"],
    ],
  ];

  test.each(
    cases.map(([events, expectedElapsedTimes, expectedOngoingTasks]) => ({
      events,
      expected: {
        elapsedTimes: new Map(Object.entries(expectedElapsedTimes)),
        ongoingTasks: new Set(expectedOngoingTasks),
      },
      name: generateCaseName(events),
    }))
  )("$name", ({ events, expected }) =>
    expect(analyzeTaskEventSequence(events)).toEqual(expected)
  );
});
