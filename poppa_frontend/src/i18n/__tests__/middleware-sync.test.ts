import { routing } from "../routing";
import { config } from "../../middleware";

describe("middleware i18n configuration", () => {
  it("should have a matcher pattern that includes all routing locales", () => {
    const routingLocales = new Set(routing.locales);

    // Extract the locale pattern from the matcher
    // Matcher format: ["/" , "/(locale1|locale2|...)/:path*"]
    const localePattern = config.matcher[1];
    expect(localePattern).toBeDefined();

    // Parse locales from the regex pattern: "/(af|ar|az|...)/:path*"
    const match = localePattern.match(/^\/\(([^)]+)\)\/:path\*$/);
    expect(match).not.toBeNull();

    const matcherLocales = new Set(match![1].split("|"));

    // Check that all routing locales are in the matcher
    const missingFromMatcher = [...routingLocales].filter(
      (locale) => !matcherLocales.has(locale)
    );
    expect(missingFromMatcher).toEqual([]);

    // Check that all matcher locales are in routing (no stale locales)
    const extraInMatcher = [...matcherLocales].filter(
      (locale) => !routingLocales.has(locale)
    );
    expect(extraInMatcher).toEqual([]);
  });

  it("should have the same number of locales in routing and middleware", () => {
    const routingLocales = routing.locales;

    const localePattern = config.matcher[1];
    const match = localePattern.match(/^\/\(([^)]+)\)\/:path\*$/);
    const matcherLocales = match![1].split("|");

    expect(matcherLocales.length).toBe(routingLocales.length);
  });

  it("should have middleware matcher locales in alphabetical order", () => {
    const localePattern = config.matcher[1];
    const match = localePattern.match(/^\/\(([^)]+)\)\/:path\*$/);
    const matcherLocales = match![1].split("|");

    const sorted = [...matcherLocales].sort((a, b) => a.localeCompare(b));
    expect(matcherLocales).toEqual(sorted);
  });

  it("should include root path in matcher", () => {
    expect(config.matcher).toContain("/");
  });
});
