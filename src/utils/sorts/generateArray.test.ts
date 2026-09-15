import generateArray from "./generateArray";

const userResponse = (city: string) => ({
  ok: true,
  status: 200,
  json: async () => ({ results: [{ name: { first: "Ann" }, location: { city } }] }),
});

const mockFetch = jest.fn();

beforeEach(() => {
  global.fetch = mockFetch as unknown as typeof fetch;
  mockFetch.mockReset();
  jest.spyOn(console, "log").mockImplementation(() => undefined);
});
afterEach(() => jest.restoreAllMocks());

describe("generateArray", () => {
  test("returns random numbers for the default variant", async () => {
    const array = await generateArray(5, 0);
    expect(array).toHaveLength(5);
    (array as number[]).forEach((value) => expect(value).toBeGreaterThanOrEqual(0));
  });

  test("variant 14 keeps only cities shorter than 8 chars", async () => {
    mockFetch
      .mockResolvedValueOnce(userResponse("Lviv"))
      .mockResolvedValueOnce(userResponse("Zhytomyr"));
    expect(await generateArray(2, 14)).toEqual(["Lviv"]);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  test("variant 9 returns an empty array without negative numbers", async () => {
    // Math.random -> 0.2: every sign factor is positive
    jest.spyOn(Math, "random").mockReturnValue(0.2);
    expect(await generateArray(4, 9)).toEqual([]);
  });

  test("rejects when randomuser.me fails", async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 503 });
    await expect(generateArray(1, 8)).rejects.toThrow("randomuser.me responded with 503");
  });

  test("rejects on an unexpected response", async () => {
    mockFetch.mockResolvedValue({ ok: true, status: 200, json: async () => ({ error: "limit" }) });
    await expect(generateArray(1, 8)).rejects.toThrow("Unexpected response from randomuser.me");
  });
});
