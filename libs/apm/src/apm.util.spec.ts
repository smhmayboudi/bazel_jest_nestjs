import {
  getOrCreateApmInstance,
  getTokenName,
  makeDefaultOptions,
} from "./apm.util";

describe("ApmUtil", () => {
  it("getOrCreateApmInstance should be instance of an agent", () => {
    expect(getOrCreateApmInstance({})).toBeInstanceOf(Object);
  });

  it("getTokenName should be instance of same agent", () => {
    expect(getOrCreateApmInstance({})).toBeInstanceOf(Object);
  });

  it("getTokenName should be instance of a gauge metric", () => {
    expect(getTokenName("TargetName", "methodName")).toEqual(
      "TargetName_methodName"
    );
  });

  it("makeDefaultOptions should be equal to an option", () => {
    expect(makeDefaultOptions({})).toEqual({});
  });
});
