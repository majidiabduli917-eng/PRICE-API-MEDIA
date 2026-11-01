export default function handler(req, res) {
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed"
    });
  }

  return res.status(200).json({
    success: true,
    name: "PRINCE MINI MEDIA API",
    version: "1.0.0",
    status: "online",
    endpoints: {
      youtube: "/api/youtube",
      tiktok: "/api/tiktok",
      instagram: "/api/instagram",
      facebook: "/api/facebook"
    }
  });
}
