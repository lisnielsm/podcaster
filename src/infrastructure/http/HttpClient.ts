export class HttpClient {
  private readonly corsProxies = [
    "https://api.allorigins.win/raw?url=",
    "https://corsproxy.io/?",
    "https://cors-anywhere.herokuapp.com/",
  ];
  private currentProxyIndex = 0;

  async get<T>(url: string, useCorsProxy = true): Promise<T> {
    if (!useCorsProxy) {
      return this.fetchDirect<T>(url);
    }

    // Try with each proxy until one works
    for (let i = 0; i < this.corsProxies.length; i++) {
      try {
        const proxyUrl =
          this.corsProxies[
            (this.currentProxyIndex + i) % this.corsProxies.length
          ];
        const finalUrl = `${proxyUrl}${encodeURIComponent(url)}`;

        const response = await fetch(finalUrl);

        if (!response.ok) {
          console.warn(
            `Proxy ${proxyUrl} failed with status: ${response.status}`
          );
          continue;
        }

        const data = (await response.json()) as T;

        // If it works, update the current proxy for future calls
        this.currentProxyIndex =
          (this.currentProxyIndex + i) % this.corsProxies.length;
        return data;
      } catch (error) {
        console.warn(`Proxy failed:`, error);
        continue;
      }
    }

    // If all proxies fail, throw error
    throw new Error("All CORS proxies failed");
  }

  private async fetchDirect<T>(url: string): Promise<T> {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as T;
    return data;
  }

  async post<T, B = unknown>(
    url: string,
    body: B,
    useCorsProxy = true
  ): Promise<T> {
    try {
      const finalUrl = useCorsProxy
        ? `${this.corsProxies[this.currentProxyIndex]}${encodeURIComponent(
            url
          )}`
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
