import { cn, ellipsisMiddle } from "@/lib/utils";

describe("utils", () => {
  describe("cn", () => {
    it("should merge class names correctly", () => {
      expect(cn("foo", "bar")).toBe("foo bar");
    });

    it("should handle conditional classes", () => {
      expect(cn("foo", false && "bar", "baz")).toBe("foo baz");
    });

    it("should merge tailwind classes correctly", () => {
      expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
    });

    it("should handle arrays of classes", () => {
      expect(cn(["foo", "bar"], "baz")).toBe("foo bar baz");
    });

    it("should handle undefined and null", () => {
      expect(cn("foo", undefined, null, "bar")).toBe("foo bar");
    });

    it("should handle empty inputs", () => {
      expect(cn()).toBe("");
    });

    it("should handle object notation", () => {
      expect(cn({ foo: true, bar: false, baz: true })).toBe("foo baz");
    });
  });

  describe("ellipsisMiddle", () => {
    it("should not truncate short strings", () => {
      expect(ellipsisMiddle("hello", 5, 5)).toBe("hello");
    });

    it("should truncate long strings with ellipsis", () => {
      expect(ellipsisMiddle("hello world test", 5, 4)).toBe("hello...test");
    });

    it("should handle strings exactly at the limit", () => {
      expect(ellipsisMiddle("abcdefgh", 4, 4)).toBe("abcdefgh");
    });

    it("should handle empty strings", () => {
      expect(ellipsisMiddle("", 5, 5)).toBe("");
    });

    it("should work with different start and end lengths", () => {
      expect(ellipsisMiddle("1234567890", 2, 3)).toBe("12...890");
    });
  });
});
