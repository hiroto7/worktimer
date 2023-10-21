import { analyzeEssentialEventSequence, move, type EssentialEvent } from ".";

const generateCaseName = (activities: readonly EssentialEvent[]) =>
  `[${activities.map(({ task, type }) => `${task}.${type}`).join(", ")}]`;

test("generateCaseName", () => {
  const activities: readonly EssentialEvent[] = [
    { task: "t1", time: 2, type: "resume" },
    { task: "t1", time: 3, type: "pause" },
    { task: "t2", time: 5, type: "resume" },
  ];
  expect(generateCaseName(activities)).toBe("[t1.resume, t1.pause, t2.resume]");
});

describe("analyzeEssentialEventSequence", () => {
  const cases: readonly [
    readonly EssentialEvent[],
    Readonly<Record<string, number>>,
    readonly string[],
    number | undefined,
  ][] = [
    [[], {}, [], undefined],
    [[{ task: "t1", time: 2, type: "resume" }], {}, ["t1"], 2],
    [
      [
        { task: "t1", time: 2, type: "resume" },
        { task: "t1", time: 3, type: "pause" },
      ],
      { t1: 1 },
      [],
      3,
    ],
    [
      [
        { task: "t1", time: 2, type: "resume" },
        { task: "t1", time: 3, type: "pause" },
        { task: "t1", time: 5, type: "resume" },
      ],
      { t1: 1 },
      ["t1"],
      5,
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
      7,
    ],
    [
      [
        { task: "t1", time: 2, type: "resume" },
        { task: "t1", time: 3, type: "pause" },
        { task: "t2", time: 5, type: "resume" },
      ],
      { t1: 1 },
      ["t2"],
      5,
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
      7,
    ],
    [
      [
        { task: "t1", time: 3, type: "resume" },
        { task: "t2", time: 5, type: "resume" },
      ],
      { t1: 2 },
      ["t1", "t2"],
      5,
    ],
    [
      [
        { task: "t1", time: 3, type: "resume" },
        { task: "t2", time: 5, type: "resume" },
        { task: "t1", time: 7, type: "pause" },
      ],
      { t1: 3, t2: 1 },
      ["t2"],
      7,
    ],
    [
      [
        { task: "t1", time: 3, type: "resume" },
        { task: "t2", time: 5, type: "resume" },
        { task: "t2", time: 7, type: "pause" },
      ],
      { t1: 3, t2: 1 },
      ["t1"],
      7,
    ],
  ];

  test.each(
    cases.map(
      ([
        events,
        expectedElapsedTimes,
        expectedOngoingTasks,
        lastEventTime,
      ]) => ({
        events,
        expected: {
          elapsedTimes: new Map(Object.entries(expectedElapsedTimes)),
          ongoingTasks: new Set(expectedOngoingTasks),
          lastEventTime,
        },
        name: generateCaseName(events),
      }),
    ),
  )("$name", ({ events, expected }) =>
    expect(analyzeEssentialEventSequence(events)).toEqual(expected),
  );
});

describe("move", () => {
  const array = ["a", "b", "c", "d", "e"];

  test("move 1 -> 3", () => {
    const expected = ["a", "c", "d", "b", "e"];
    expect(move(array, 1, 3)).toEqual(expected);
  });

  test("move 3 -> 2", () => {
    const expected = ["a", "b", "d", "c", "e"];
    expect(move(array, 3, 2)).toEqual(expected);
  });

  test("move 2 -> 2", () => {
    expect(move(array, 2, 2)).toBe(array);
  });
});
