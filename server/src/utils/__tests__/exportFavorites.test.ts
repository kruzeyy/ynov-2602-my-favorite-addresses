import { addressesToCsv, addressesToJson } from "../exportFavorites";

describe("exportFavorites", () => {
  const sampleAddresses = [
    {
      id: 1,
      name: "Chez moi",
      description: "Appartement",
      lat: 48.8566,
      lng: 2.3522,
      createdAt: "2025-01-15T10:00:00.000Z",
    },
    {
      id: 2,
      name: "Bureau",
      description: undefined,
      lat: 48.87,
      lng: 2.33,
      createdAt: "2025-01-16T09:00:00.000Z",
    },
  ];

  describe("addressesToCsv", () => {
    it("should return CSV with header line id,name,description,lat,lng,createdAt", () => {
      const result = addressesToCsv(sampleAddresses);
      expect(result).toContain("id,name,description,lat,lng,createdAt");
    });

    it("should return one data row per address", () => {
      const result = addressesToCsv(sampleAddresses);
      const lines = result.trim().split("\n");
      expect(lines.length).toBe(3); // header + 2 rows
    });

    it("should escape fields containing commas and quotes", () => {
      const withComma = [
        {
          id: 1,
          name: 'Chez "moi", Paris',
          description: "Appart",
          lat: 48.85,
          lng: 2.35,
          createdAt: "2025-01-15T10:00:00.000Z",
        },
      ];
      const result = addressesToCsv(withComma);
      // RFC 4180: quoted field with doubled double-quotes
      expect(result).toContain('"Chez ""moi"", Paris"');
    });

    it("should return only header line when addresses array is empty", () => {
      const result = addressesToCsv([]);
      const lines = result.trim().split("\n");
      expect(lines.length).toBe(1);
      expect(lines[0]).toBe("id,name,description,lat,lng,createdAt");
    });

    it("should handle missing description with empty column", () => {
      const noDesc = [
        {
          id: 1,
          name: "Place",
          description: undefined,
          lat: 48.85,
          lng: 2.35,
          createdAt: "2025-01-15T10:00:00.000Z",
        },
      ];
      const result = addressesToCsv(noDesc);
      expect(result).toContain("id,name,description,lat,lng,createdAt");
      expect(result).toContain("1,Place,");
    });
  });

  describe("addressesToJson", () => {
    it("should return valid JSON array string", () => {
      const result = addressesToJson(sampleAddresses);
      const parsed = JSON.parse(result);
      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed.length).toBe(2);
    });

    it("should include id, name, description, lat, lng, createdAt in each object", () => {
      const result = addressesToJson(sampleAddresses);
      const parsed = JSON.parse(result);
      expect(parsed[0]).toMatchObject({
        id: 1,
        name: "Chez moi",
        description: "Appartement",
        lat: 48.8566,
        lng: 2.3522,
      });
      expect(parsed[0]).toHaveProperty("createdAt");
    });

    it("should return empty array string when addresses is empty", () => {
      const result = addressesToJson([]);
      expect(result).toBe("[]");
    });
  });
});
