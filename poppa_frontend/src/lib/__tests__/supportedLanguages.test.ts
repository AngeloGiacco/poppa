import { interface_locales, learnable_languages } from "../supportedLanguages";

describe("supportedLanguages", () => {
  describe("interface_locales", () => {
    it("should contain at least 40 interface languages", () => {
      expect(interface_locales.length).toBeGreaterThanOrEqual(40);
    });

    it("should have required properties for each locale", () => {
      interface_locales.forEach((locale) => {
        expect(locale).toHaveProperty("code");
        expect(locale).toHaveProperty("name");
        expect(locale).toHaveProperty("native_name");
        expect(locale).toHaveProperty("icon");
        expect(locale).toHaveProperty("locale");

        expect(typeof locale.code).toBe("string");
        expect(typeof locale.name).toBe("string");
        expect(typeof locale.native_name).toBe("string");
        expect(typeof locale.locale).toBe("string");
      });
    });

    it("should include major world languages", () => {
      const majorLanguages = [
        "English",
        "Chinese",
        "Spanish",
        "French",
        "German",
        "Japanese",
        "Korean",
        "Arabic",
        "Russian",
        "Portuguese (Portugal)",
        "Italian",
      ];

      majorLanguages.forEach((lang) => {
        const found = interface_locales.find((l) => l.name === lang);
        expect(found).toBeDefined();
      });
    });

    it("should have unique locale codes", () => {
      const locales = interface_locales.map((l) => l.locale);
      const uniqueLocales = new Set(locales);
      expect(uniqueLocales.size).toBe(locales.length);
    });

    it("should have English as first locale", () => {
      expect(interface_locales[0].name).toBe("English");
      expect(interface_locales[0].locale).toBe("en");
    });
  });

  describe("learnable_languages", () => {
    it("should contain at least 50 learnable languages", () => {
      expect(learnable_languages.length).toBeGreaterThanOrEqual(50);
    });

    it("should have required properties for each language", () => {
      learnable_languages.forEach((language) => {
        expect(language).toHaveProperty("code");
        expect(language).toHaveProperty("name");
        expect(language).toHaveProperty("native_name");
        expect(language).toHaveProperty("icon");
        expect(language).toHaveProperty("iso639");

        expect(typeof language.code).toBe("string");
        expect(typeof language.name).toBe("string");
        expect(typeof language.native_name).toBe("string");
        expect(typeof language.iso639).toBe("string");
      });
    });

    it("should have ISO 639 codes for all languages", () => {
      learnable_languages.forEach((language) => {
        expect(language.iso639).toBeTruthy();
        expect(language.iso639.length).toBeGreaterThanOrEqual(3);
      });
    });

    it("should include all major European languages", () => {
      const europeanLanguages = [
        "English",
        "Spanish",
        "French",
        "German",
        "Italian",
        "Portuguese (Portugal)",
        "Dutch",
        "Polish",
        "Swedish",
        "Greek",
        "Czech",
        "Danish",
        "Finnish",
        "Norwegian",
        "Hungarian",
      ];

      europeanLanguages.forEach((lang) => {
        const found = learnable_languages.find((l) => l.name === lang);
        expect(found).toBeDefined();
      });
    });

    it("should include major Asian languages", () => {
      const asianLanguages = [
        "Chinese",
        "Japanese",
        "Korean",
        "Hindi",
        "Thai",
        "Vietnamese",
        "Indonesian",
        "Malay",
        "Bengali",
        "Tamil",
      ];

      asianLanguages.forEach((lang) => {
        const found = learnable_languages.find((l) => l.name === lang);
        expect(found).toBeDefined();
      });
    });

    it("should include Middle Eastern languages", () => {
      const middleEasternLanguages = ["Arabic", "Hebrew", "Persian", "Turkish"];

      middleEasternLanguages.forEach((lang) => {
        const found = learnable_languages.find((l) => l.name === lang);
        expect(found).toBeDefined();
      });
    });

    it("should include African languages", () => {
      const africanLanguages = ["Swahili", "Hausa", "Somali", "Afrikaans"];

      africanLanguages.forEach((lang) => {
        const found = learnable_languages.find((l) => l.name === lang);
        expect(found).toBeDefined();
      });
    });

    it("should have unique ISO 639 codes except for regional variants", () => {
      const iso639Codes = learnable_languages.map((l) => l.iso639);
      const duplicates = iso639Codes.filter((code, index) => iso639Codes.indexOf(code) !== index);

      // Only por (Portuguese) should be duplicated for Portugal and Brazil variants
      const allowedDuplicates = ["por"];
      const unexpectedDuplicates = duplicates.filter(
        (d) => !allowedDuplicates.includes(d.replace("-br", ""))
      );

      expect(unexpectedDuplicates.length).toBe(0);
    });

    it("should have matching entries in interface_locales for common languages", () => {
      const commonLanguages = ["English", "Spanish", "French", "German", "Italian"];

      commonLanguages.forEach((lang) => {
        const inLearnable = learnable_languages.find((l) => l.name === lang);
        const inInterface = interface_locales.find((l) => l.name === lang);

        expect(inLearnable).toBeDefined();
        expect(inInterface).toBeDefined();
        expect(inLearnable?.native_name).toBe(inInterface?.native_name);
      });
    });
  });

  describe("data consistency", () => {
    it("should have valid country codes (2 letters)", () => {
      const allLanguages = [...interface_locales, ...learnable_languages];

      allLanguages.forEach((lang) => {
        expect(lang.code).toMatch(/^[A-Z]{2}$/);
      });
    });

    it("should have non-empty native names", () => {
      const allLanguages = [...interface_locales, ...learnable_languages];

      allLanguages.forEach((lang) => {
        expect(lang.native_name.trim()).not.toBe("");
      });
    });

    it("should have icon components defined", () => {
      const allLanguages = [...interface_locales, ...learnable_languages];

      allLanguages.forEach((lang) => {
        expect(lang.icon).toBeDefined();
        expect(typeof lang.icon).toBe("function");
      });
    });
  });
});
