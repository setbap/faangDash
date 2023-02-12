import { Box, LinkBox, SimpleGrid, useColorMode } from "@chakra-ui/react";
import { StatsCard } from "lib/components/charts/StateCard";
import { NextSeo } from "next-seo";
import HeaderSection from "lib/components/basic/HeaderSection";
import StackedAreaChart from "lib/components/charts/StackedAreaGraph";
import BarGraph from "lib/components/charts/BarGraph";
import { CompanyType } from "pages/[company]";
import CandleChart from "lib/components/charts/CandleChart";
import CalendarChart from "lib/components/charts/CalendarChart";
import TextBox from "lib/components/charts/TextBox";
import CompanyLinkBox from "lib/components/basic/LinkBox";
import { FaAmazon, FaFacebook, FaGoogle } from "react-icons/fa";
import { BsApple, BsFacebook } from "react-icons/bs";
import { RiNetflixFill } from "react-icons/ri";

const colors = [
  "#4caf50",
  "#f44336",
  "#03a9f4",
  "#ff5722",
  "#ffc107",
  "#00bcd4",
  "#9c27b0",
  "#673ab7",
  "#3f51b5",
  "#2196f3",
  "#009688",
  "#607d8b",
];

const Home = (): JSX.Element => {
  return (
    <>
      <NextSeo title={`Faang Stock Data overview`} />
      <Box mx={"auto"} pt="4" px={{ base: 3, sm: 2, md: 8 }}>
        <SimpleGrid
          my={"6"}
          columns={{ base: 1, md: 1, lg: 2, "2xl": 3 }}
          spacing={{ base: 3, lg: 4 }}
        >
          <HeaderSection title={`FAANG`}>
            {`
FAANG is an acronym for the top five most successful technology stocks on the stock market, which include Facebook, Amazon, Apple, Netflix and Google. These companies have been some of the best performing stocks in recent years due to their innovative products and services that are highly sought after by consumers worldwide. For example, Facebook has a massive user base with over 2 billion active users while Amazon dominates online retailing with its wide selection of products and unbeatable prices. Apple’s iPhones remain popular despite stiff competition from other smartphone makers while Netflix continues to revolutionize television entertainment through its streaming platform. Finally Google remains at the forefront of search engine technology as well as cloud computing solutions for businesses around the world. All these companies offer investors attractive returns when investing in their respective shares on public exchanges like NASDAQ or NYSE.
        `}
          </HeaderSection>
          <HeaderSection title={`Dataset`}>
            {`
We used Kaggle - a popular online website which gives users access to thousands of public datasets. One user Aayush Mishra had uploaded a dataset with all FAANG stock ticks with the features - Date, Open, Close, High, Low, Adj Close and Volume - in a dataset named FAANG- Complete Stock Data. The link for this dataset is provided below: 

[Kaggle Faang Data](https://www.kaggle.com/aayushmishra1512/faang-complete-stock-data)

The dataset is reliable and we used Yahoo Stocks to verify that the given data's ticks matched perfectly with the actual data recorded by Yahoo Stocks.
        `}
          </HeaderSection>
          <HeaderSection title={`Insights`}>
            {`

The general trend of all stocks' price features were increasing over time. This is in line with the reason FAANG stocks are popular. They are considered "Blue Chip" stocks since they're meant to be held for a long time due to their upward trend. The FAANG stocks are often grouped together since they relate to the larger technology companies in Silicon Valley based on their stock prices. We saw from our Close Prices plot that they have an increase over time which shows us why these stocks are "Blue Chip".
`}
          </HeaderSection>
        </SimpleGrid>

        <SimpleGrid
          position={"relative"}
          transition={"all 0.9s ease-in-out"}
          pb={"6"}
          gap={4}
          zIndex={100}
          columns={{ sm: 2, md: 3, lg: 4, "2xl": 5 }}
          spacing={{ base: 1, md: 2, lg: 4 }}
        >
          <CompanyLinkBox
            path={"Facebook"}
            Icon={BsFacebook}
            hoverColor="#3b5998"
          />
          <CompanyLinkBox path={"Apple"} Icon={BsApple} hoverColor="#a2aaa2" />
          <CompanyLinkBox
            path={"Amazon"}
            Icon={FaAmazon}
            hoverColor="#ff9000"
          />
          <CompanyLinkBox
            path={"Netflix"}
            Icon={RiNetflixFill}
            hoverColor="#e50914"
          />
          <CompanyLinkBox
            path={"Google"}
            Icon={FaGoogle}
            hoverColor="#179c52"
          />
        </SimpleGrid>
      </Box>
    </>
  );
};

export default Home;
