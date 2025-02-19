import axios from "axios";

export async function GET() {
  try {
    const { data } = await axios.get(
      "https://data-api.coindesk.com/index/cc/v1/historical/minutes?market=cadli&instrument=BTC-USD&limit=288&aggregate=5&fill=true&apply_mapping=true&response_format=JSON",
      {
        headers: {
          "x-api-key": process.env.CDC_API_KEY,
        },
      }
    );
    return new Response(JSON.stringify(data), {
      status: 200,
    });
    //eslint-disable-next-line
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "failed to fetch coin historical data" }),
      {
        status: 500,
      }
    );
  }
}
