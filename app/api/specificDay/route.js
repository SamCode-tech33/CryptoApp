import axios from "axios";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const tsym = searchParams.get("tsym");
  const fsym = searchParams.get("fsym");
  const toTs = searchParams.get("toTs");
  const limit = searchParams.get("limit");

  try {
    const { data } = await axios.get(
      `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${fsym}&tsym=${tsym}&limit=${limit}&toTs=${toTs}`,
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
