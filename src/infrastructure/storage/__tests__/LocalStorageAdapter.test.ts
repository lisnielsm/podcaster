import { LocalStorageAdapter } from "../LocalStorageAdapter";

describe("LocalStorageAdapter", () => {
  let adapter: LocalStorageAdapter;
  let mockLocalStorage: Record<string, string>;

  beforeEach(() => {
    adapter = new LocalStorageAdapter();
    mockLocalStorage = {};

    // Mock localStorage
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn((key: string) => mockLocalStorage[key] || null),
        setItem: jest.fn((key: string, value: string) => {
          mockLocalStorage[key] = value;
        }),
        removeItem: jest.fn((key: string) => {
          delete mockLocalStorage[key];
        }),
        clear: jest.fn(() => {
          mockLocalStorage = {};
        }),
      },
      writable: true,
    });

    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("get", () => {
    it("should return parsed value from localStorage", () => {
      mockLocalStorage["testKey"] = JSON.stringify({ name: "test" });

      const result = adapter.get<{ name: string }>("testKey");

      expect(result).toEqual({ name: "test" });
    });

    it("should return null when key does not exist", () => {
      const result = adapter.get<string>("nonExistentKey");

      expect(result).toBeNull();
    });

    it("should return null on JSON parse error", () => {
      mockLocalStorage["invalidJson"] = "not valid json";

      const result = adapter.get<string>("invalidJson");

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });

    it("should handle array values", () => {
      mockLocalStorage["arrayKey"] = JSON.stringify([1, 2, 3]);

      const result = adapter.get<number[]>("arrayKey");

      expect(result).toEqual([1, 2, 3]);
    });

    it("should handle primitive values", () => {
      mockLocalStorage["numberKey"] = JSON.stringify(42);

      const result = adapter.get<number>("numberKey");

      expect(result).toBe(42);
    });
  });

  describe("set", () => {
    it("should stringify and store value in localStorage", () => {
      adapter.set("testKey", { name: "test" });

      expect(localStorage.setItem).toHaveBeenCalledWith(
        "testKey",
        JSON.stringify({ name: "test" })
      );
    });

    it("should store array values", () => {
      adapter.set("arrayKey", [1, 2, 3]);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        "arrayKey",
        JSON.stringify([1, 2, 3])
      );
    });

    it("should store primitive values", () => {
      adapter.set("numberKey", 42);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        "numberKey",
        JSON.stringify(42)
      );
    });

    it("should handle circular reference error", () => {
      const circularObj: Record<string, unknown> = { name: "test" };
      circularObj.self = circularObj;

      // This should not throw
      adapter.set("circularKey", circularObj);

      expect(console.error).toHaveBeenCalled();
    });
  });

  describe("remove", () => {
    it("should remove item from localStorage", () => {
      mockLocalStorage["testKey"] = "value";

      adapter.remove("testKey");

      expect(localStorage.removeItem).toHaveBeenCalledWith("testKey");
    });

    it("should not throw when removing non-existent key", () => {
      expect(() => adapter.remove("nonExistentKey")).not.toThrow();
      expect(localStorage.removeItem).toHaveBeenCalledWith("nonExistentKey");
    });
  });

  describe("clear", () => {
    it("should clear all localStorage items", () => {
      mockLocalStorage["key1"] = "value1";
      mockLocalStorage["key2"] = "value2";

      adapter.clear();

      expect(localStorage.clear).toHaveBeenCalled();
    });
  });

  describe("Error Handling", () => {
    it("should handle localStorage.getItem throwing", () => {
      (localStorage.getItem as jest.Mock).mockImplementation(() => {
        throw new Error("Storage error");
      });

      const result = adapter.get<string>("testKey");

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });

    it("should handle localStorage.setItem throwing", () => {
      (localStorage.setItem as jest.Mock).mockImplementation(() => {
        throw new Error("Storage full");
      });

      // Should not throw
      expect(() => adapter.set("testKey", "value")).not.toThrow();
      expect(console.error).toHaveBeenCalled();
    });

    it("should handle localStorage.removeItem throwing", () => {
      (localStorage.removeItem as jest.Mock).mockImplementation(() => {
        throw new Error("Remove error");
      });

      // Should not throw
      expect(() => adapter.remove("testKey")).not.toThrow();
      expect(console.error).toHaveBeenCalled();
    });

    it("should handle localStorage.clear throwing", () => {
      (localStorage.clear as jest.Mock).mockImplementation(() => {
        throw new Error("Clear error");
      });

      // Should not throw
      expect(() => adapter.clear()).not.toThrow();
      expect(console.error).toHaveBeenCalled();
    });
  });
});
