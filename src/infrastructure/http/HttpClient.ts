export class HttpClient {
  private readonly corsProxies = [
    "https://api.allorigins.win/raw?url=",
    "https://corsproxy.io/?",
    "https://cors-anywhere.herokuapp.com/",
  ];
  private currentProxyIndex = 0;

  async get<T>(url: string): Promise<T> {
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
}
