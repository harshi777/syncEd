import("next").NextConfig;
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "images.pexels.com" },
      { hostname: "res.cloudinary.com" }, // Add this entry
    ],
  },
};

export default nextConfig;
