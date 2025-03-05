import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

const handleImageError = (
  event: React.SyntheticEvent<HTMLImageElement, Event>
) => {
  event.currentTarget.src = "https://i.ibb.co/rKMFQPFM/pngaaa-com-3638314.png";
};

export const addCommas = (num: number) => {
  if (num === null) {
    num = 0;
  }
  const coinPriceArray = num.toFixed(0).split("");
  const decimals = num.toFixed(2);
  const coinDecimals = decimals.slice(decimals.length - 3);
  const coinPriceCommas = coinPriceArray.map((num: any, i: number) => {
    const commaSpot = (coinPriceArray.length - (i + 1)) % 3;
    if (commaSpot === 0 && i !== coinPriceArray.length - 1) {
      num = num + ",";
    }
    return num;
  });
  if (num === 0) {
    return 0;
  } else {
    return coinPriceCommas.join("") + coinDecimals;
  }
};

export const sliderSettings = {
  dots: false,
  infinite: false,
  speed: 800,
  slidesToShow: 6,
  slidesToScroll: 6,
  initialSlide: 0,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 4,
        infinite: false,
        dots: false,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        initialSlide: 2,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

export const Updownarrow = ({ coin }: { coin: any }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={coin > 0 ? "#11D861" : "#E9190F"}
      viewBox="0 0 24 24"
      stroke={coin > 0 ? "#11D861" : "#E9190F"}
      className="h-4 mr-1"
    >
      <path
        d={
          coin > 0 ? "m4.5 15.75 7.5-7.5 7.5 7.5" : "m19.5 8.25-7.5 7.5-7.5-7.5"
        }
      />
    </svg>
  );
};

export const Staticarrow = ({ way, color }: { way: any; color: any }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={color}
      viewBox="0 0 24 24"
      stroke={color}
      className="h-4 mr-3"
    >
      <path d={way} />
    </svg>
  );
};

export const Plus = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className="size-6 mr-3"
    >
      <path d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
};

export const Defaulticon = ({ coin }: { coin: any }) => {
  return (
    <img
      id="currentPhoto"
      src={`https://assets.coincap.io/assets/icons/${coin.symbol.toLowerCase()}@2x.png`}
      alt=""
      onError={handleImageError}
      className="h-8 mx-4"
    />
  );
};

export const CustomTooltip = ({ active, payload }: any) => {
  const compare = useSelector((state: RootState) => state.symbol.compare);
  if (active && payload && payload.length) {
    const valueProper = payload[0].payload.valueProper;
    const valueCompProper = payload[0].payload.valueCompProper;
    const name = payload[0].payload.name;
    return (
      <div className="text-violet-500 text-2xl mt-3 flex flex-col items-end">
        <p>{name}</p>
        <p>${valueProper}</p>
        <p className={compare.length ? "value-comp-tool" : "hidden"}>
          ${valueCompProper}
        </p>
      </div>
    );
  }
};

const formatDate = (date: any) => {
  const formattedDate = new Date(date);
  const month = formattedDate.getMonth() + 1;
  const day = formattedDate.getDate();
  const hours = formattedDate.getHours();
  const minutes = formattedDate.getMinutes();
  return `${month}/${day} ${hours}:${minutes}`;
};

export const CustomTooltip1 = ({ active, payload }: any) => {
  const compare = useSelector((state: RootState) => state.symbol.compare);
  if (active && payload && payload.length) {
    const valueProper = payload[0].payload.valueProper;
    const valueCompProper = payload[0].payload.valueCompProper;
    const name = formatDate(payload[0].payload.name);
    return (
      <div className="text-white text-sm mt-2 flex flex-col items-end">
        <p>{name}</p>
        <p>${valueProper}</p>
        <p className={compare.length ? "value-comp-tool" : "hidden"}>
          ${valueCompProper}
        </p>
      </div>
    );
  }
};

export const CustomizedLabel = (props: any) => {
  const { x, y, height, width, index } = props;
  return (
    <text
      x={x + width / 2}
      y={y + height + 12}
      dy={11}
      fill="white"
      fontSize={13}
      textAnchor="middle"
    >
      {index + 1}
    </text>
  );
};
