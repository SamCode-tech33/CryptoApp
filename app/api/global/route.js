import axios from "axios";

export async function GET() {
  try {
    const { data } = await axios.get(
      "https://api.coingecko.com/api/v3/global",
      {
        headers: {
          "x-cg-demo-api-key": process.env.GKO_API_KEY,
        },
      }
    );
    return new Response(JSON.stringify(data), {
      status: 200,
    });
    //eslint-disable-next-line
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch coin performance data" }),
      {
        status: 500,
      }
    );
  }
}
