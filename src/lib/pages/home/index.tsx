import { Box, SimpleGrid } from "@chakra-ui/react";
import { StatsCard } from "lib/components/charts/StateCard";
import { NextSeo } from "next-seo";
import HeaderSection from "lib/components/basic/HeaderSection";
import StackedAreaChart from "lib/components/charts/StackedAreaGraph";
import BarGraph from "lib/components/charts/BarGraph";
import { CompanyType } from "pages/[company]";
import CandleChart from "lib/components/charts/CandleChart";
import CalendarChart from "lib/components/charts/CalendarChart";

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

const Home = ({
  data: {
    dayWithMaxVolume,
    dayWithMinVolume,
    monthlyVolume,
    dayWithHighestDrop,
    dayWithHighestDropInPercentage,
    dayWithHighestGrowth,
    dayWithHighestGrowthInPercentage,
    monthlyCandleInfo,
    companyYearVolume,
    yearRange,
  },
  company,
}: CompanyType): JSX.Element => {
  return (
    <>
      <NextSeo title={`${company} Stock Data`} />
      <Box mx={"auto"} pt="4" px={{ base: 3, sm: 2, md: 8 }}>
        <HeaderSection title={`${company} Data`} />

        <SimpleGrid
          my={"6"}
          columns={{ base: 1, md: 2, lg: 3, "2xl": 4 }}
          spacing={{ base: 3, lg: 4 }}
        >
          <StatsCard
            stat={dayWithMaxVolume[0].close}
            comment={"close price"}
            title={`Day With Highest Volume ${dayWithMaxVolume[0].company}`}
            status="inc"
            unit={dayWithMaxVolume[0].date}
          />

          <StatsCard
            stat={dayWithMinVolume[0].close}
            comment={"close price"}
            title={`Day With Lowest Volume ${dayWithMinVolume[0].company}`}
            status="dec"
            unit={dayWithMinVolume[0].date}
          />

          <StatsCard
            stat={dayWithHighestGrowth[0].close}
            comment={"close price"}
            changeUnit="$"
            change={dayWithHighestGrowth[0].Change}
            title={`Highest Increase ${dayWithHighestGrowth[0].company}`}
            status="inc"
            hasArrowIcon
            unit={dayWithHighestGrowth[0].date}
          />
          <StatsCard
            stat={dayWithHighestDrop[0].close}
            comment={"close price"}
            changeUnit="$"
            change={dayWithHighestDrop[0].Change}
            title={`Highest Increase ${dayWithHighestDrop[0].company}`}
            status="inc"
            hasArrowIcon
            unit={dayWithHighestDrop[0].date}
          />

          <StatsCard
            stat={dayWithHighestGrowthInPercentage[0].close}
            comment={"close price"}
            changeUnit="%"
            change={dayWithHighestGrowthInPercentage[0].Change}
            title={`Highest Increase ${dayWithHighestGrowthInPercentage[0].company} in %`}
            status="inc"
            hasArrowIcon
            unit={dayWithHighestGrowthInPercentage[0].date}
          />
          <StatsCard
            stat={dayWithHighestDropInPercentage[0].close}
            comment={"close price"}
            changeUnit="%"
            change={dayWithHighestDropInPercentage[0].Change}
            title={`Highest Increase ${dayWithHighestDropInPercentage[0].company} in %`}
            status="inc"
            hasArrowIcon
            unit={dayWithHighestDropInPercentage[0].date}
          />
        </SimpleGrid>

        <SimpleGrid
          position={"relative"}
          transition={"all 0.9s ease-in-out"}
          pb={"6"}
          gap={4}
          zIndex={100}
          columns={{ sm: 1, md: 1, lg: 2, "2xl": 3 }}
          spacing={{ base: 1, md: 2, lg: 4 }}
        >
          <HeaderSection title="Daily Stock Volume" />
          <CalendarChart
            baseSpan={3}
            xAxisDataKey={"date"}
            areaDataKey={"volume"}
            title={`${company} Daily Stock Volume`}
            tooltipTitle={""}
            selectExtraData={(year) => ({ year, company })}
            data={companyYearVolume.data}
            years={yearRange.map(({ year }) => year)}
            selectedYear={2016}
          />
          <HeaderSection title="Average Volume of each Month" />
          <StackedAreaChart
            isNotDate
            extraInfoToTooltip=""
            modalInfo=""
            values={monthlyVolume.data}
            title={`Monthly Volume of ${company}`}
            dataKey="yearMonth"
            oyLabel="$USD"
            oxLabel=""
            baseSpan={3}
            labels={monthlyVolume.monthlyInfoKey.map((key, index) => ({
              color: colors[index],
              key: key,
            }))}
          />
          {/* <LineChartWithBar
            data={dailyTemperature}
            queryLink={""}
            title={"Temperature in FR"}
            baseSpan={3}
            customColor={colors[0]}
            barColor={colors[2]}
            xAxisDataKey="Day"
            barDataKey={"FR Temp"}
            lineDataKey="avg temp"
          /> */}
          <HeaderSection title="Total Volume each month" />
          <BarGraph
            isNotDate
            extraInfoToTooltip=""
            modalInfo=""
            values={monthlyVolume.data}
            title={`Monthly Volume of ${company}`}
            dataKey="yearMonth"
            oyLabel="$USD"
            oxLabel=""
            baseSpan={3}
            labels={[
              {
                color: colors[4],
                key: "Total Volume",
              },
            ]}
          />
          <HeaderSection title="Stock Price Change" />
          <CandleChart
            disclaimer="from 2012 to 2020"
            title={` The monthly stock price of ${company}`}
            data={monthlyCandleInfo.data}
            baseSpan={3}
          />
        </SimpleGrid>
      </Box>
    </>
  );
};

export default Home;
