import axios from "axios";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("instrument");
  const timePeriod = searchParams.get("timeperiod");
  const limit = searchParams.get("limit");
  try {
    const { data } = await axios.get(
      `https://data-api.coindesk.com/index/cc/v1/historical/${timePeriod}?market=cadli&instrument=${symbol}-USD&limit=${limit}&aggregate=5&fill=true&apply_mapping=true&response_format=JSON`,
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
