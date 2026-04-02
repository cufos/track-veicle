export const vehicleApiService = {
  async getVehicleImage(brand: string, model: string): Promise<string | undefined> {
    try {
      // Using Unsplash source without API key (simple public image query)
      const query = encodeURIComponent(`${brand} ${model} car`);
      return `https://api.unsplash.com/600x400/?${query}`;
    } catch (error) {
      return undefined;
    }
  },
};
