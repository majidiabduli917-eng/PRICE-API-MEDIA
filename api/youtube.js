
export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Use POST method"
    });
  }

  const apiKey = process.env.EASYDOWN_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      success: false,
      message: "EasyDown API key is missing"
    });
  }

  try {
    const { url } = req.body || {};

    if (!url || typeof url !== "string") {
      return res.status(400).json({
        success: false,
        message: "Please provide a YouTube URL"
      });
    }

    const videoUrl = new URL(url);

    const allowedHosts = [
      "youtube.com",
      "www.youtube.com",
      "m.youtube.com",
      "youtu.be",
      "www.youtube-nocookie.com"
    ];

    if (!allowedHosts.includes(videoUrl.hostname)) {
      return res.status(400).json({
        success: false,
        message: "Invalid YouTube URL"
      });
    }

    const response = await fetch(
      "https://api.easydown.org/api/v1/platforms/youtube/parse",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ url }),
        signal: AbortSignal.timeout(25000)
      }
    );

    const data = await response.json();

    return res.status(response.status).json({
      success: response.ok,
      ...data
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "YouTube processing failed",
      error: error.name === "TimeoutError"
        ? "Request timed out"
        : "Unable to process video"
    });
  }
}
