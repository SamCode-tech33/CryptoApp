// multiple coins page

export interface HistoricalDataPoint {
  time: number; // UNIX timestamp
  HIGH: number;
  LOW: number;
  OPEN: number;
  CLOSE: number;
  INSTRUMENT: string;
  volumefrom: number;
  volumeto: number;
}

export interface HistoricalDataPointHour {
  time: number; // timestamp in seconds
  HIGH: number;
  LOW: number;
  OPEN: number;
  CLOSE: number;
  volumefrom: number;
  volumeto: number;
  INSTRUMENT: string;
  QUOTE_VOLUME?: number;
}

export interface BarGraphProps {
  coinHistoryHour: HistoricalDataPointHour[];
  coinCompareHour: HistoricalDataPointHour[];
  coinName: string;
  compare: string; // empty string if no comparison
  coinCompName: string; // name of coin being compared
  today?: string;
}

export type TimeSelection =
  | "minutes 5 288" // 1D
  | "hours 1 168" // 7D
  | "hours 1 336" // 14D
  | "hours 2 360" // 30D
  | "days 1 365" // 1Y
  | "days 4 457"; // 5Y

export interface HistoricalApiResponse {
  Data: HistoricalDataPoint[];
}

//linegraph

export interface LineGraphProps {
  coinHistory: HistoricalDataPoint[];
  coinCompare: HistoricalDataPoint[];
  limit: number;
  rendered?: boolean;
  symbol?: string;
  selectedTime: string;
  compare: string;
  loading?: boolean;
  today: string;
  currency: string;
  compareHidden?: boolean;
  onConverter?: boolean;
  rightSym?: string;
  coinCompName?: string;
  coinName: string;
}

//bargraph

export interface CoinbarProps {
  currencySymbol: string; // e.g., "$" or "¥"
  value1: number; // primary value for the bar
  value2: number; // secondary value for comparison (can be 0)
  first?: boolean;
  index?: number;
  coinQuote?: any; // Indicates which rendering branch to use
}

// single coin page

export interface CoinInfo {
  urls: {
    website: string[];
    technical_doc: string[];
    message_board: string[];
    source_code: string[];
  };
  description: string;
}

export interface QuoteData {
  price: number;
  volume_24h: number;
  percent_change_1h: number;
  market_cap: number;
  fully_diluted_market_cap: number;
}

export interface CoinData {
  id: number;
  name: string;
  symbol: string;
  circulating_supply: number;
  max_supply: number | null;
  quote: Record<string, QuoteData>;
}

export interface HistoryItem {
  high: number;
  low: number;
  time: number;
}

// coinfilter

export interface CoinfilterProps {
  handleFullClear: () => void; // called when reset clears all filters
  // eslint-disable-next-line
  handleFilterRender: (queryString: string) => void; // called when Apply is clicked
  closeFocus: () => void; // called to close the filter UI
}

//global header

export interface GlobalData {
  active_cryptocurrencies?: number;
  markets?: number;
  total_market_cap?: Record<string, number>;
  total_volume?: Record<string, number>;
  market_cap_change_percentage_24h_usd?: number;
  market_cap_percentage?: {
    btc?: number;
    eth?: number;
  };
}

//NavList

export interface CoinQuote {
  price: number;
  percent_change_1h: number;
  percent_change_24h: number;
  percent_change_7d: number;
  volume_24h: number;
  market_cap: number;
}

export interface Coin {
  id: string;
  name: string;
  symbol: string;
  quote: {
    [currency: string]: CoinQuote;
    USD: CoinQuote;
  };
  circulating_supply: number;
  max_supply: number | null;
}

export interface QueryObject {
  q?: string;
  price?: string;
  hour1?: string;
  hour24?: string;
  day7?: string;
}

// seven day mini graph

export interface CoinHistoryInterval {
  HIGH: number;
  LOW: number;
  INSTRUMENT: string;
}

export interface SevendaygraphProps {
  symbol: string;
  sevenDay: string;
}

export interface PData {
  name: string;
  value: number;
  valueProper: string;
}

// utility helper functions

export interface GraphData {
  coin: string;
  name: string;
  value: number;
  valueProper: string;
  valueComp?: number;
  valueCompProper?: string;
}

export interface GraphResult {
  max: number;
  min: number;
  coinHist: GraphData[];
}

export interface VolumeGraphResult {
  totalVolume: number;
  coinHist: GraphData[];
}

export interface ArrowProps {
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export interface StaticarrowProps {
  way: string; // SVG path string
  color: string; // stroke/fill colour
}

export interface DefaulticonProps {
  coin: string;
  height?: string;
  margin?: string;
}

export interface CustomTooltipProps {
  active?: boolean;
  payload?: {
    payload: { valueProper: string; valueCompProper?: string; name: string };
  }[];
  compHidden?: boolean;
  onConverter?: boolean;
  rightSym?: string;
  currency?: string;
}

export interface CustomToolTipMiniProps {
  active?: boolean;
  payload?: { payload: { valueProper: string; name: string } }[];
}

// portfolio types

export interface PortQuote {
  price: number;
  volume_24h: number;
  market_cap: number;
  percent_change_24h: number;
}

export interface PortCoin {
  name: string;
  symbol: string;
  max_supply: number | null;
  circulating_supply: number;
  quote: Record<string, CoinQuote>;
}

export interface PortfolioItem {
  coinName: string;
  coinSymbol: string;
  coinAmount: number;
  currencyAmount: number;
  date: string;
  dateUnix: number;
  id: number;
}
