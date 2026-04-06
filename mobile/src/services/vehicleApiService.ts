type ImageCacheEntry = {
  images: string[];
  timestamp: number;
};

const imageCache: Record<string, ImageCacheEntry> = {};
const CACHE_DURATION = 1000 * 60 * 60 * 24; // 24 horas

export const vehicleApiService = {
  async getVehicleImages(
    brand: string,
    model: string,
    year?: number,
  ): Promise<string[]> {
    try {
      // ✅ En Expo las variables deben comenzar con EXPO_PUBLIC_
      const apiKey =
        process.env.EXPO_PUBLIC_IMAGES_CAR_KEY ||
        process.env.IMAGES_CAR_KEY;

      if (!apiKey) {
        console.warn("API KEY not found");
        return [];
      }

      const cacheKey = `${brand}-${model}-${year || ""}`.toLowerCase();

      // ✅ Cache local en memoria
      const cached = imageCache[cacheKey];
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.images;
      }

      const make = encodeURIComponent(brand);
      const modelEncoded = encodeURIComponent(model);
      const yearParam = year ? `&year=${year}` : "";

      // ✅ Usar endpoint oficial signed-url
      const url = `https://carimagesapi.com/api/v1/signed-url?api_key=${apiKey}&make=${make}&model=${modelEncoded}${yearParam}`;

      const response = await fetch(url);

      if (!response.ok) {
        console.warn("CarImagesAPI error:", response.status);
        return [];
      }

      const data = await response.json();

      // ✅ La API devuelve: { url: "https://..." }
      const images: string[] = data?.url ? [data.url] : [];

      // ✅ Guardar en cache
      imageCache[cacheKey] = {
        images,
        timestamp: Date.now(),
      };

      return images;
    } catch (error) {
      console.warn("Error fetching vehicle images:", error);
      return [];
    }
  },

  // ✅ Fallback automático
  getFallbackImage(): string {
    return "local-default";
  },
};
