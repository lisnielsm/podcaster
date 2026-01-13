export class HttpClient {
  private readonly corsProxyUrl = "https://corsproxy.io/?";

  async get<T>(url: string, useCorsProxy = true): Promise<T> {
    try {
      const finalUrl = useCorsProxy
        ? `${this.corsProxyUrl}${encodeURIComponent(url)}`
        : url;

      const response = await fetch(finalUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = (await response.json()) as T;

      return data;
    } catch (error) {
      console.error("HttpClient error:", error);
      throw error;
    }
  }

  async post<T, B = unknown>(
    url: string,
    body: B,
    useCorsProxy = true
  ): Promise<T> {
    try {
      const finalUrl = useCorsProxy
        ? `${this.corsProxyUrl}${encodeURIComponent(url)}`
        : url;

      const response = await fetch(finalUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = (await response.json()) as T;

      return data;
    } catch (error) {
      console.error("HttpClient error:", error);
      throw error;
    }
  }
}
