import axios from "axios";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const start = searchParams.get("start");
    const limit = searchParams.get("limit");
    const convert = searchParams.get("convert");

    const { data } = await axios.get(
      "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest",
      {
        headers: {
          "X-CMC_PRO_API_KEY": process.env.CMC_API_KEY,
        },
        params: { start, limit, convert },
      }
    );

    return new Response(JSON.stringify(data), {
      status: 200,
    });
    //eslint-disable-next-line
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch coins" }), {
      status: 500,
    });
  }
}
