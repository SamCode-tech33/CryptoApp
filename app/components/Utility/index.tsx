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
    return "Infinite";
  } else {
    return coinPriceCommas.join("") + coinDecimals;
  }
};

export const handleImageError = (
  event: React.SyntheticEvent<HTMLImageElement, Event>
) => {
  event.currentTarget.src = "https://i.ibb.co/rKMFQPFM/pngaaa-com-3638314.png";
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
