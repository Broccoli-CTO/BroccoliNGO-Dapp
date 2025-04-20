import Image from "next/image";
import React from "react";
import styled from "@emotion/styled";
import Link from "next/link";
import { useI18n } from "@/components/ui/I18nProvider";

export const Trading = () => {
  
  const { trans } = useI18n();
  
  const images = [
    {
      img: "/trading/binance.png",
      link: "https://www.binance.com/trade/BROCCOLI714_USDT?type=spot",
      width: 372,
      height: 90,
    },
    {
      img: "/trading/bybit.png",
      link: "https://www.bybit.com/trade/usdt/BROCCOLIUSDT",
      width: 194,
      height: 90,
    },
    {
      img: "/trading/PancakeSwap.png",
      link: "https://pancakeswap.finance/swap?inputCurrency=BNB&outputCurrency=0x6d5AD1592ed9D6D1dF9b93c793AB759573Ed6714&exactAmount=&exactField=INPUT",
      width: 490,
      height: 91,
    },
    {
      img: "/trading/gate.png",
      link: "https://www.gate.io/trade/BROCCOLI_USDT",
      width: 227,
      height: 90,
    },
    {
      img: "/trading/bitget.png",
      link: "https://www.bitget.com/spot/BROCCOLIUSDT",
      width: 90,
      height: 90,
    },
    {
      img: "/trading/htx.png",
      link: "https://www.htx.com/trade/broccoli_usdt/",
      width: 210,
      height: 117,
    },
    {
      img: "/trading/mexc.png",
      link: "https://www.mexc.com/exchange/BROCCOLI_USDT",
      width: 144,
      height: 90,
    },
    {
      img: "/trading/bingx.png",
      link: "https://bingx.com/en/spot/BROCCOLIUSDT/",
      width: 227,
      height: 90,
    },
  ];

  return (
    <Container>
      <Title>
        <p>BROCCOLI</p>
        {trans(_TL_('trading live on:'))}
      </Title>

      <Border>
        <TradingContainer>
          {images.map((image, idx) => (
            <ImgContainer key={idx} style={{ aspectRatio: `${image.width}/${image.height}` }}>
              <Link href={image.link} target="_blank">
                <Image src={image.img} alt="" fill style={{ objectFit: "contain" }} />
              </Link>
            </ImgContainer>
          ))}
        </TradingContainer>

        <ViewText>
          <Dashes />
          <div>{trans(_TL_('View over 50 trading pairs on'))}</div>
          <Dashes />
        </ViewText>

        <MarketContainer>
          <Link href="https://coinmarketcap.com/currencies/czsdog-broccoli/" target="_blank">
            <MarketImageContainer>
              <Image src="/trading/CoinMarketCap.png" alt="" fill style={{ objectFit: "contain" }} />
            </MarketImageContainer>
          </Link>
          <Link href="https://www.coingecko.com/en/coins/czs-dog" target="_blank">
            <MarketImageContainer>
              <Image src="/trading/coingecko.png" alt="" fill style={{ objectFit: "contain" }} />
            </MarketImageContainer>
          </Link>
        </MarketContainer>
      </Border>
    </Container>
  );
};

const Container = styled.div`
  margin-top: 140px;
  margin-bottom: 60px;

  @media screen and (max-width: 768px) {
    margin-top: 90px;
    margin-bottom: 40px;
  }
`;

const Border = styled.div`
  max-width: 960px;
  border-image: url("/trading/border.png") 40 40;
  border-width: 20px;
  margin: 60px auto;
  padding: 40px 0;
  background-color: #fff;

  @media screen and (max-width: 768px) {
    border-image: url("/trading/border.png") 40 40;
    border-width: 15px;
    width: 310px;
    margin: 40px auto;
    padding: 20px 0;
  }
`;

const Title = styled.div`
  color: #fbbc05;
  text-align: center;
  font-family: var(--font-darumadrop-one);
  font-size: 56px;
  font-style: normal;
  font-weight: 400;
  line-height: 100%; /* 56px */
  letter-spacing: -1.12px;

  @media screen and (max-width: 768px) {
    font-size: 32px;
    letter-spacing: -0.64px;
  }
`;

const TradingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin-left: auto;
  margin-right: auto;
  width: 676px;

  @media screen and (max-width: 768px) {
    width: 290px;
  }
`;

const ImgContainer = styled.div`
  position: relative;
  height: 40px;
  margin-right: 40px;
  margin-bottom: 40px;

  a {
    display: block;
    height: 100%;
  }

  @media screen and (max-width: 768px) {
    height: 20px;
    margin-right: 20px;
    margin-bottom: 20px;
  }
`;

const ViewText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px auto 50px;
  gap: 10px;
  width: 676px;
  font-size: 20px;
  font-weight: 600;

  @media screen and (max-width: 768px) {
    width: 258px;
    font-size: 15px;
    margin-bottom: 30px;
  }
`;

const Dashes = styled.div`
  flex: 1;
  height: 1px;
  border: dashed 1px #000;
  transform: scaleY(0.5);
`;

const MarketContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;

  @media screen and (max-width: 768px) {
    gap: 20px;
  }
`;

const MarketImageContainer = styled.div`
  position: relative;
  width: 60px;
  height: 60px;

  @media screen and (max-width: 768px) {
    width: 40px;
    height: 40px;
  }
`;
