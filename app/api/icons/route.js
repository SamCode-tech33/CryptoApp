import axios from "axios";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const coinSym = searchParams.get("sym");
  try {
    const response = await axios.get(
      `https://assets.coincap.io/assets/icons/${coinSym}@2x.png`,
      { responseType: "arraybuffer" } // Ensure it returns raw image data
    );
    return new Response(response.data, {
      status: 200,
      headers: { "Content-Type": "image/png" },
    });
    //eslint-disable-next-line
  } catch (error) {
    return new Response(JSON.stringify({ error: "failed to fetch image" }), {
      status: 500,
    });
  }
}
