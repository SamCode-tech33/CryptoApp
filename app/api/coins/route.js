import axios from "axios";

export async function GET() {
  try {
    const { data } = await axios.get(
      "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest",
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
    return new Response(JSON.stringify({ error: "Failed to fetch coins" }), {
      status: 500,
    });
  }
}
