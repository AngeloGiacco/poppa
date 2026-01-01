import { generateThinkingMethodInstruction } from "@/lib/lesson-utils";

describe("lesson-utils", () => {
  describe("generateThinkingMethodInstruction", () => {
    it("should generate instruction with correct language placeholders", () => {
      const instruction = generateThinkingMethodInstruction("Spanish", "English");

      expect(instruction).toContain("learning Spanish");
      expect(instruction).toContain("speaks English");
      expect(instruction).toContain("talk to them in English");
      expect(instruction).toContain("introduce vocab and phrases in Spanish");
    });

    it("should include socratic method principles", () => {
      const instruction = generateThinkingMethodInstruction("French", "German");

      expect(instruction).toContain("socratic method");
      expect(instruction).toContain("Never directly explain grammar rules");
      expect(instruction).toContain("Never ask students to memorize anything");
    });

    it("should work with various language combinations", () => {
      const combinations = [
        { target: "Japanese", native: "Korean" },
        { target: "Mandarin", native: "Vietnamese" },
        { target: "Portuguese", native: "Italian" },
      ];

      combinations.forEach(({ target, native }) => {
        const instruction = generateThinkingMethodInstruction(target, native);
        expect(instruction).toContain(`learning ${target}`);
        expect(instruction).toContain(`speaks ${native}`);
      });
    });

    it("should include teaching patterns", () => {
      const instruction = generateThinkingMethodInstruction("Arabic", "English");

      expect(instruction).toContain("Present a small piece of language");
      expect(instruction).toContain("Ask questions that lead students to notice patterns");
    });

    it("should include guidelines on what to avoid", () => {
      const instruction = generateThinkingMethodInstruction("Hindi", "English");

      expect(instruction).toContain("Giving grammar rules directly");
      expect(instruction).toContain("Asking for memorization");
    });
  });
});
