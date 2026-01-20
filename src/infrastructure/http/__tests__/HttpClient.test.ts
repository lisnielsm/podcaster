import { HttpClient } from "../HttpClient";

describe("HttpClient", () => {
  let httpClient: HttpClient;

  beforeEach(() => {
    httpClient = new HttpClient();
    jest.spyOn(console, "warn").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("get", () => {
    describe("with CORS proxy", () => {
      it("should fetch data using first proxy when successful", async () => {
        const mockData = { result: "success" };
        global.fetch = jest.fn().mockResolvedValue({
          ok: true,
          json: () => Promise.resolve(mockData),
        });

        const result = await httpClient.get<{ result: string }>(
          "https://api.example.com/data"
        );

        expect(result).toEqual(mockData);
        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining("api.allorigins.win")
        );
      });

      it("should encode URL when using proxy", async () => {
        global.fetch = jest.fn().mockResolvedValue({
          ok: true,
          json: () => Promise.resolve({}),
        });

        await httpClient.get("https://api.example.com/data?param=value");

        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining(
            encodeURIComponent("https://api.example.com/data?param=value")
          )
        );
      });

      it("should try next proxy when first fails with non-ok response", async () => {
        let callCount = 0;
        global.fetch = jest.fn().mockImplementation(() => {
          callCount++;
          if (callCount === 1) {
            return Promise.resolve({ ok: false, status: 500 });
          }
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ data: "success" }),
          });
        });

        const result = await httpClient.get<{ data: string }>(
          "https://api.example.com/data"
        );

        expect(result).toEqual({ data: "success" });
        expect(fetch).toHaveBeenCalledTimes(2);
        expect(console.warn).toHaveBeenCalled();
      });

      it("should try next proxy when first throws error", async () => {
        let callCount = 0;
        global.fetch = jest.fn().mockImplementation(() => {
          callCount++;
          if (callCount === 1) {
            return Promise.reject(new Error("Network error"));
          }
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ data: "success" }),
          });
        });

        const result = await httpClient.get<{ data: string }>(
          "https://api.example.com/data"
        );

        expect(result).toEqual({ data: "success" });
        expect(fetch).toHaveBeenCalledTimes(2);
      });

      it("should throw error when all proxies fail", async () => {
        global.fetch = jest.fn().mockResolvedValue({
          ok: false,
          status: 500,
        });

        await expect(
          httpClient.get("https://api.example.com/data")
        ).rejects.toThrow("All CORS proxies failed");
      });

      it("should update currentProxyIndex on success", async () => {
        let callCount = 0;
        global.fetch = jest.fn().mockImplementation(() => {
          callCount++;
          if (callCount === 1) {
            return Promise.resolve({ ok: false, status: 500 });
          }
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ data: "success" }),
          });
        });

        // First call - first proxy fails, second succeeds
        await httpClient.get("https://api.example.com/data");

        // Reset mock
        callCount = 0;
        (fetch as jest.Mock).mockClear();
        global.fetch = jest.fn().mockResolvedValue({
          ok: true,
          json: () => Promise.resolve({ data: "cached" }),
        });

        // Second call - should start with the working proxy
        await httpClient.get("https://api.example.com/other");

        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining("corsproxy.io")
        );
      });
    });
  });
});
