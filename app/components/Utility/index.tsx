import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { Arrowright } from "../svgComps";
import {
  CoinHistoryInterval,
  GraphResult,
  GraphData,
  VolumeGraphResult,
  HistoricalDataPointHour,
  ArrowProps,
  StaticarrowProps,
  DefaulticonProps,
  CustomTooltipProps,
  CustomToolTipMiniProps,
} from "@/app/zenCoinTypes";

const handleImageError = (
  event: React.SyntheticEvent<HTMLImageElement, Event>
) => {
  event.currentTarget.src = "https://i.ibb.co/rKMFQPFM/pngaaa-com-3638314.png";
};

export const addCommas = (num: number | null): string => {
  if (num === null) {
    num = 0;
  }
  const coinPriceArray = num.toFixed(0).split("");
  const decimals = num.toFixed(2);
  const coinDecimals = decimals.slice(decimals.length - 3);
  const coinPriceCommas = coinPriceArray.map((numChar, i) => {
    const commaSpot = (coinPriceArray.length - (i + 1)) % 3;
    if (commaSpot === 0 && i !== coinPriceArray.length - 1) {
      return numChar + ",";
    }
    return numChar;
  });
  return num === 0 ? "0" : coinPriceCommas.join("") + coinDecimals;
};

const SamplePrevArrow: React.FC<ArrowProps> = (props) => {
  /* eslint-disable react/prop-types */
  const { onClick } = props;
  return (
    <div
      onClick={onClick}
      className="h-8 flex bg-slate-300 hover:bg-slate-400 absolute w-8 -left-8 top-6 items-center rounded-3xl justify-center cursor-pointer rotate-180 dark:bg-slate-700 dark:hover:bg-slate-500"
    >
      <Arrowright />
    </div>
  );
};

const SampleNextArrow: React.FC<ArrowProps> = (props) => {
  const { onClick } = props;
  return (
    <div
      onClick={onClick}
      className="h-8 flex bg-slate-300 hover:bg-slate-400 absolute w-8 left-full top-6 items-center rounded-3xl justify-center cursor-pointer dark:bg-slate-700 dark:hover:bg-slate-500"
    >
      <Arrowright />
    </div>
  );
};

export const sliderSettings = {
  dots: false,
  infinite: false,
  adaptiveHeight: true,
  speed: 800,
  slidesToShow: 6,
  slidesToScroll: 6,
  nextArrow: <SampleNextArrow />,
  prevArrow: <SamplePrevArrow />,
  responsive: [
    {
      breakpoint: 1900,
      settings: {
        slidesToShow: 5,
        slidesToScroll: 5,
        infinite: false,
        dots: false,
      },
    },
    {
      breakpoint: 1615,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 4,
        initialSlide: 4,
      },
    },
    {
      breakpoint: 1340,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        arrows: false,
        touchMove: true,
      },
    },
    {
      breakpoint: 640,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 4,
        arrows: false,
        touchMove: true,
      },
    },
  ],
};

/* eslint-disable react/prop-types */
export const Updownarrow: React.FC<{ coin: any }> = ({ coin }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill={coin > 0 ? "#11D861" : "#E9190F"}
    viewBox="0 0 24 24"
    stroke={coin > 0 ? "#11D861" : "#E9190F"}
    className="h-3 mr-0.5"
  >
    <path
      d={coin > 0 ? "m4.5 15.75 7.5-7.5 7.5 7.5" : "m19.5 8.25-7.5 7.5-7.5-7.5"}
    />
  </svg>
);

/* eslint-disable react/prop-types */
export const Staticarrow: React.FC<StaticarrowProps> = ({ way, color }) => (
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

/* eslint-disable react/prop-types */
export const Defaulticon: React.FC<DefaulticonProps> = ({
  coin,
  height = "",
  margin = "",
}) => (
  <img
    id="currentPhoto"
    src={`https://assets.coincap.io/assets/icons/${coin.toLowerCase()}@2x.png`}
    alt={coin}
    onError={handleImageError}
    className={`${height} ${margin}`}
  />
);

/* eslint-disable react/prop-types */
export const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  compHidden,
  onConverter,
  rightSym,
  currency,
}) => {
  const compare = useSelector((state: RootState) => state.symbol.compare);
  const currencySymbolFromStore = useSelector(
    (state: RootState) => state.currency.currencySymbol
  );
  const currencySymbol = currency ?? currencySymbolFromStore;

  if (active && payload && payload.length) {
    const valueProper = payload[0].payload.valueProper;
    const valueCompProper = payload[0].payload.valueCompProper;
    const name = payload[0].payload.name.split(" ");
    const date = (
      name[1] +
      " " +
      name[2] +
      ", " +
      name[3] +
      " " +
      name[4]
    ).split(":");
    const formattedDate = date[0] + ":" + date[1];
    return (
      <div className="dark:text-white flex flex-col items-end dark:bg-slate-900 p-2 rounded-md z-99 bg-slate-300">
        <p>{formattedDate}</p>
        <p>
          {onConverter ? (
            <span>
              {valueProper} {rightSym}
            </span>
          ) : (
            <span>
              {currencySymbol} {valueProper}
            </span>
          )}
        </p>
        {compHidden ? (
          ""
        ) : (
          <p className={compare.length ? "value-comp-tool" : "hidden"}>
            {currencySymbol} {valueCompProper}
          </p>
        )}
      </div>
    );
  }

  return null;
};

/* eslint-disable react/prop-types */
const formatDate = (date: string) => {
  const formattedDate = new Date(date);
  const month = formattedDate.getMonth() + 1;
  const day = formattedDate.getDate();
  const hours = formattedDate.getHours();
  const minutes = formattedDate.getMinutes();
  return `${month}/${day} ${hours}:${minutes}`;
};

/* eslint-disable react/prop-types */
export const CustomToolTipMini: React.FC<CustomToolTipMiniProps> = ({
  active,
  payload,
}) => {
  const currencySymbol = useSelector(
    (state: RootState) => state.currency.currencySymbol
  );

  if (active && payload && payload.length) {
    const valueProper = payload[0].payload.valueProper;
    const name = formatDate(payload[0].payload.name);

    return (
      <div className="dark:text-white dark:bg-slate-900 text-xs sm:flex flex-col items-end z-99 rounded-md hidden px-4 py-2 bg-slate-300">
        <p>{name}</p>
        <p>
          {currencySymbol}
          {valueProper}
        </p>
      </div>
    );
  }
  return null;
};

interface CustomizedLabelProps {
  x?: number;
  y?: number;
  width?: number;
  index?: number;
  value?: any;
}

/* eslint-disable react/prop-types */
export const CustomizedLabel: React.FC<CustomizedLabelProps> = (props) => {
  const { x = 0, width = 0, index = 0 } = props;
  return (
    <text
      x={x + width / 2}
      y={248}
      fill="rgb(226 232 240)"
      fontSize={13}
      textAnchor="middle"
    >
      {index + 1}
    </text>
  );
};

export function getGraphData(
  coinHistory: CoinHistoryInterval[],
  selectedTime: string,
  graphTime: number,
  graphPeriod: number,
  max: number,
  min: number
): GraphResult {
  const coinHist: GraphData[] = coinHistory.map((interval, i) => {
    if (i !== 0 && interval.HIGH > coinHistory[i - 1].HIGH) max = interval.HIGH;
    if (i !== 0 && interval.LOW < coinHistory[i - 1].LOW) min = interval.LOW;

    const value = (interval.HIGH + interval.LOW) / 2;
    const valueProper = addCommas(value);

    // Adjust graph timing based on selectedTime
    switch (selectedTime) {
      case "minutes 5 288":
        graphTime = 300_000;
        graphPeriod = 86_400_000;
        break;
      case "hours 1 168":
        graphTime = 3_600_000;
        graphPeriod = 604_800_000;
        break;
      case "hours 1 336":
        graphTime = 3_600_000;
        graphPeriod = 1_209_600_000;
        break;
      case "hours 2 360":
        graphTime = 7_200_000;
        graphPeriod = 2_592_000_000;
        break;
      case "days 1 365":
        graphTime = 86_400_000;
        graphPeriod = 31_579_200_000;
        break;
      case "days 4 457":
        graphTime = 345_600_000;
        graphPeriod = 157_939_200_000;
        break;
    }

    return {
      coin: interval.INSTRUMENT,
      name: new Date(Date.now() + i * graphTime - graphPeriod + graphTime)
        .toString()
        .split("G")[0],
      value,
      valueProper,
    };
  });

  return { max, min, coinHist };
}

export function getGraphComparison(
  pdata: GraphResult,
  pdataComp: GraphResult
): GraphData[] {
  return pdata.coinHist.map((data, index) => {
    if (pdataComp.coinHist.length) {
      const comp = pdataComp.coinHist[index] ?? { value: 0, valueProper: "0" };
      return {
        ...data,
        valueComp: comp.value,
        valueCompProper: comp.valueProper,
      };
    }
    return data;
  });
}

export function getVolumeGraphData(
  coinPeriod: HistoricalDataPointHour[],
  totalVolume: number
): VolumeGraphResult {
  const coinHist: GraphData[] = coinPeriod.map((hour, i) => {
    const value = hour.QUOTE_VOLUME ?? 0;
    totalVolume += value;
    const valueProper = addCommas(value);
    return {
      coin: hour.INSTRUMENT,
      name: new Date(Date.now() + i * 3_600_000 - 86_400_000 + 3_600_000)
        .toString()
        .split("G")[0],
      value,
      valueProper,
    };
  });

  return { totalVolume, coinHist };
}

export function getVolumeGraphComparison(
  pdata: VolumeGraphResult,
  pdataComp: VolumeGraphResult
): GraphData[] {
  return pdata.coinHist.map((data, index) => {
    if (pdataComp.coinHist.length) {
      const comp = pdataComp.coinHist[index] ?? { value: 0, valueProper: "0" };
      return {
        ...data,
        valueComp: comp.value,
        valueCompProper: comp.valueProper,
      };
    }
    return data;
  });
}
