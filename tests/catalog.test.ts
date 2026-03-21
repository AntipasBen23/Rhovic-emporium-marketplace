import { describe, expect, it } from "vitest";
import { normalizeProduct } from "../src/lib/catalog";

describe("normalizeProduct", () => {
  it("keeps gallery images in order and promotes the first image to cover", () => {
    const product = normalizeProduct({
      ID: "prd_1",
      Name: "Ankara Fabric",
      Price: 15000,
      ImageURLs: [
        "https://cdn.example.com/cover.jpg",
        "https://cdn.example.com/detail-1.jpg",
        "https://cdn.example.com/detail-2.jpg",
      ],
    });

    expect(product.imageUrl).toBe("https://cdn.example.com/cover.jpg");
    expect(product.imageUrls).toEqual([
      "https://cdn.example.com/cover.jpg",
      "https://cdn.example.com/detail-1.jpg",
      "https://cdn.example.com/detail-2.jpg",
    ]);
  });

  it("falls back to single image_url when gallery images are unavailable", () => {
    const product = normalizeProduct({
      id: "prd_2",
      name: "Leather Shoe",
      price: "32000",
      image_url: "https://cdn.example.com/single.jpg",
    });

    expect(product.imageUrl).toBe("https://cdn.example.com/single.jpg");
    expect(product.imageUrls).toEqual(["https://cdn.example.com/single.jpg"]);
  });

  it("filters invalid gallery values instead of returning empty strings", () => {
    const product = normalizeProduct({
      id: "prd_3",
      name: "Handbag",
      price: 22000,
      image_urls: ["", "https://cdn.example.com/bag.jpg", "   "],
    });

    expect(product.imageUrls).toEqual(["https://cdn.example.com/bag.jpg"]);
    expect(product.imageUrl).toBe("https://cdn.example.com/bag.jpg");
  });
});
