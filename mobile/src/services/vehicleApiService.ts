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
      const apiKey = process.env.IMAGES_CAR_KEY;
      if (!apiKey) return [];

      const cacheKey = `${brand}-${model}-${year || ""}`.toLowerCase();

      // ✅ Cache local en memoria
      const cached = imageCache[cacheKey];
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.images;
      }

      const make = encodeURIComponent(brand);
      const modelEncoded = encodeURIComponent(model);
      const yearParam = year ? `&year=${year}` : "";

      const url = `https://carimagesapi.com/api/v1/images?make=${make}&model=${modelEncoded}${yearParam}&api_key=${apiKey}`;

      const response = await fetch(url);
      if (!response.ok) return [];

      const data = await response.json();

      // ✅ Soporte para múltiples imágenes
      const images: string[] =
        data?.data?.map((item: any) => item.image || item.url).filter(Boolean) ||
        data?.images ||
        [];

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
