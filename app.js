import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// 🌐 Spotify Access Token Storage
let accessToken = "";

// 🔐 Fetch Spotify Access Token on Startup
const getSpotifyToken = async () => {
  const client_id = process.env.CLIENT_ID;
  const client_secret = process.env.CLIENT_SECRET;

  const authHeader = Buffer.from(`${client_id}:${client_secret}`).toString("base64");

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      "grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${authHeader}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    accessToken = response.data.access_token;
    console.log("✅ Spotify access token retrieved.");
  } catch (error) {
    console.error("❌ Failed to get Spotify token:", error.response?.data || error.message);
  }
};

await getSpotifyToken(); // Fetch token before server starts

setInterval(() => {
  getSpotifyToken();
  console.log("🔄 Token refreshed automatically");
}, 55 * 60 * 1000); // Refresh every 55 minutes



// 🏠 Home Route
app.get("/", (req, res) => {
  res.render("index");
});

// 🔍 Search Page Route (for form access)
app.get("/search", (req, res) => {
  res.render("search", {
    songs: [],
    albums: [],
    artists: [],
    topResult: null,
    error: null
  });
});

// 🔎 Search Logic (Form POST)
app.post("/search", async (req, res) => {
  const query = encodeURIComponent(req.body.name || req.body.input);

  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/search?q=${query}&type=track,artist,album`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    const result = response.data;

    const artists = result.artists.items.map(a => ({
      name: a.name,
      image: a.images?.[0]?.url?.startsWith("https://") ? a.images[0].url : "/default-artist.jpg"

    }));

    const songs = result.tracks.items.slice(0, 7).map(t => ({
  name: t.name,
  artists: t.artists.map(a => a.name).join(", "),
  image: t.album.images?.[0]?.url || "/default-song.jpg",
  duration_ms: t.duration_ms
}));

    const albums = result.albums.items.map(a => ({
      name: a.name,
      artist: a.artists[0]?.name || "",
      image: a.images?.[0]?.url || ""
    }));

    const topResult = albums[0] || songs[0] || artists[0];

    res.render("search", { artists, songs, albums, topResult, error: null });
  } catch (error) {
    console.error("Spotify API Error:", error.response?.data || error.message);

    res.render("search", {
      artists: [],
      songs: [],
      albums: [],
      topResult: null,
      error: "Could not fetch results from Spotify."
    });
  }
});

// 🚀 Start Server
app.listen(port, () => {
  console.log(`🌐 Server running at http://localhost:${port}`);
});
