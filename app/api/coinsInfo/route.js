import axios from "axios";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const coinId = searchParams.get("id");

    if (!coinId) {
      return new Response(JSON.stringify({ error: "Missing coin ID" }), {
        status: 400,
      });
    }

    const { data } = await axios.get(
      `https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?id=${coinId}`,
      {
        headers: {
          "X-CMC_PRO_API_KEY": process.env.CMC_API_KEY,
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
