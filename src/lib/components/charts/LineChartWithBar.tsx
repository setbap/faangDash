import {
  Box,
  useColorModeValue,
  GridItem,
  MenuList,
  MenuDivider,
  MenuItemOption,
  MenuOptionGroup,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import moment from "moment";
import millify from "millify";
import {
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
} from "recharts";
import { GRID_ITEM_SIZE } from "./template";
import ChartSpanMenu from "../basic/ChartSpanMenu";
import ChartHeader from "../basic/ChartHeader";
import { FilterDayBarBox } from "../basic/FilterDayBar";
import { AnimatePresence } from "framer-motion";
import MotionBox from "../motion/Box";
import LinkToSourceMenuItem from "../basic/LinkToSourceMenuItem";
import { ModalInfo } from "../basic/ModalInfo";
import ChartImageExportMenu from "../basic/ChartImageExportMenu";

interface Props {
  modelInfo?: string;
  xAxisDataKey: string;
  showSeprate?: boolean;
  lineDataKey: string;
  hideLine?: boolean;
  barDataKey: string;
  title: string;
  data: any[];
  extraDecimal?: number;
  isNotDate?: boolean;
  domain?: [number, number];
  baseSpan?: number;
  defultSelectedRange?: number | string;
  defultDateView?: "month" | "day";
  showMonthly?: boolean;
  queryLink?: string;
  barColor: string;
  additionalDumpTextToAddKeyToKeyBeUnique?: string;
  customColor?: string;
  additionalLineKey?: string[] | null;
  infoSizePercentage?: number | "full";
}

const LineChartWithBar = ({
  baseSpan = 1,
  additionalLineKey = null,
  defultDateView = "day",
  queryLink,
  showSeprate = false,
  barColor,
  isNotDate = false,
  extraDecimal = 4,
  hideLine = false,
  lineDataKey,
  barDataKey,
  xAxisDataKey,
  data,
  title,
  modelInfo = "",
  additionalDumpTextToAddKeyToKeyBeUnique = "",
  showMonthly = false,
  infoSizePercentage = 50,
  customColor = "var(--chakra-colors-green-300)",
  defultSelectedRange = 2022
}: Props) => {
  const chartRef = useRef<null | HTMLDivElement>(null);
  const [spanItem, setSpanItem] = useState(GRID_ITEM_SIZE[baseSpan - 1]);
  const [defultViewSetting, setDefultViewSetting] = useState(defultDateView);
  const [chartData, setChartData] = useState(data);
  const [savedDailyChart, setSavedDailyChart] = useState(data);
  const filterDateAccordingDay = (numberOfDays: number) => {
    const lastDay = moment(data[data.length - 1][xAxisDataKey]).subtract(
      numberOfDays,
      "days"
    );
    const newData = data.filter((item) => {
      return moment(item[xAxisDataKey]).isAfter(lastDay);
    });
    setSelectedDate(numberOfDays);
    setChartData(newData);
  };
  const getMaxDate = () => {
    let maxD = moment(data[0][xAxisDataKey]);
    data.forEach((item) => {
      if (moment(item[xAxisDataKey]).isAfter(maxD)) {
        maxD = moment(item[xAxisDataKey]);
      }
    });
    return maxD;
  };
  const maxDate = isNotDate ? null : getMaxDate();
  const getMinDate = () => {
    let minD = moment(data[0][xAxisDataKey]);
    data.forEach((item) => {
      if (moment(item[xAxisDataKey]).isBefore(minD)) {
        minD = moment(item[xAxisDataKey]);
      }
    });
    return minD;
  };
  const minDate = isNotDate ? null : getMinDate();
  const [selectedDate, setSelectedDate] = useState<number | string>(
    defultSelectedRange === 2022 ?
      Math.round(
        (maxDate!.toDate().getTime() - new Date(2022, 0, 1).getTime()) / (1000 * 60 * 60 * 24)
      ) + 1 : 'all'
  );

  const changeDataToMonethly = () => {
    const newData: { [key: string]: number[] } = {};
    data.forEach((item) => {
      const monthName: string = moment(item[xAxisDataKey]).format("MMM YYYY");
      if (newData[monthName] === undefined) {
        newData[monthName] = [];
      }
      newData[monthName].push(item[lineDataKey]);
    });
    setDefultViewSetting("month");
    setSavedDailyChart(chartData);
    setChartData(
      Object.entries(newData).map(([key, value]) => {
        return {
          [xAxisDataKey]: key,
          [lineDataKey]: value.reduce((a, b) => a + b, 0),
        };
      })
    );
  };

  const changeDataToDaily = () => {
    setChartData(savedDailyChart);
    setDefultViewSetting("day");
  };

  const filterDateAccordingRange = (minDate: Date, maxDate: Date) => {
    const newData = data.filter((item) => {
      return (
        moment(item[xAxisDataKey]).isAfter(minDate) &&
        moment(item[xAxisDataKey]).isBefore(maxDate)
      );
    });
    setSelectedDate("custom");
    setChartData(newData);
  };

  const bgTooltip = useColorModeValue("gray.300", "gray.700");
  const bgCard = useColorModeValue("white", "#191919");
  const textColor = useColorModeValue("gray.900", "gray.100");
  const chartColor = customColor;
  const chartUniquKey = `${lineDataKey}-${xAxisDataKey}-${additionalDumpTextToAddKeyToKeyBeUnique}`;

  const resetChartData = () => {
    if (isNotDate) {
      return;
    }
    if (defultSelectedRange === 'all') {
      setChartData(data)
      return;
    }
    filterDateAccordingDay(
      Math.round(
        (maxDate!.toDate().getTime() -
          new Date(2022, 0, 1).getTime()) /
        (1000 * 60 * 60 * 24)
      ) + 1
    );
  };

  const resetToAll = () => {
    setChartData(data)
    setSelectedDate('all')
    return;
  }


  useEffect(() => {
    resetChartData();
  }, []);

  const [averageData, setaverageData] = useState(0);
  useEffect(() => {
    const avg = chartData
      .map((item) => item[barDataKey])
      .reduce((prev, current) => prev + current, 0);
    setaverageData(avg / chartData.length);
  }, [chartData]);

  return (
    <GridItem
      rowSpan={1}
      ref={chartRef}
      color={textColor}
      bgColor={bgCard}
      shadow="base"
      transition={"all 0.5s "}
      border={"2px solid transparent"}
      _hover={{ boxShadow: "var(--chakra-shadows-lg)", borderColor: "#444" }}
      borderRadius={"2xl"}
      width="100%"
      colSpan={spanItem}
      display="flex"
      flex={2}
      flexDir={
        spanItem["2xl"] !== 3 || infoSizePercentage === "full"
          ? "column-reverse"
          : ["column-reverse", "column-reverse", "column-reverse", "row", "row"]
      }
    >
      <ModalInfo
        modalInfo={modelInfo}
        infoSizePercentage={infoSizePercentage}
        largeSpanSize={baseSpan}
      />
      <Box
        flex={1}
        px="6"
        pt="4"
        pb={"2"}
        _hover={{ boxShadow: `0px 0px 4px ${bgTooltip}` }}
        display="flex"
        flexDir={"column"}
        alignItems="center"
        height={"480px"}
        // height={"400px"}
        id={title}
      >
        <ChartHeader
          chartMenu={
            <MenuList
              data-html2canvas-ignore
              bg={useColorModeValue("white", "#232323")}
            >
              {queryLink && (
                <>
                  <LinkToSourceMenuItem queryLink={queryLink} />
                  <MenuDivider />
                </>
              )}
              <>
                <ChartImageExportMenu ref={chartRef} title={title} />
                <MenuDivider />
              </>
              {showMonthly && (
                <>
                  <MenuOptionGroup
                    onChange={(value) => {
                      if (value === "month") {
                        changeDataToMonethly();
                      } else {
                        changeDataToDaily();
                      }
                    }}
                    defaultValue={defultViewSetting}
                    title="Chart Date Type"
                    type="radio"
                  >
                    <MenuItemOption value={"month"}>monthly</MenuItemOption>
                    <MenuItemOption value={"day"}>daily</MenuItemOption>
                  </MenuOptionGroup>
                  <MenuDivider />
                </>
              )}
              <ChartSpanMenu
                onChange={(span) =>
                  setSpanItem(GRID_ITEM_SIZE[Number(span) - 1])
                }
                baseSpan={baseSpan}
              />
            </MenuList>
          }
          modalInfo={modelInfo}
          title={title}
        />
        <Box p={"1"} />
        <ResponsiveContainer
          height={!isNotDate && defultViewSetting === "day" ? 380 : 425}
          width={"100%"}
        >
          <ComposedChart
            data={chartData.map((item) => ({
              ...item,
              [lineDataKey]: averageData,
            }))}
            syncId={chartUniquKey + "s"}
            className="mt-1 mb-1"
          >
            <defs>
              <linearGradient
                id={`color${additionalDumpTextToAddKeyToKeyBeUnique}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  style={{ stopColor: barColor }}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  style={{ stopColor: barColor }}
                  stopOpacity={0.3}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              style={{ stroke: "rgba(110,110,110,1)", opacity: 0.25 }}
              strokeDasharray="3 3"
            />
            <XAxis
              fontSize={12}
              color={"var(--textColor)"}
              tickFormatter={(value) => {
                if (isNotDate || defultViewSetting === "month") {
                  return value;
                }
                if (defultViewSetting === "day") {
                  return moment(value).format("MMM DD YYYY");
                }
              }}
              dataKey={xAxisDataKey}
            />

            <YAxis
              yAxisId="left"
              tickFormatter={(value) => {
                try {
                  return millify(value, {
                    precision: extraDecimal,
                    decimalSeparator: ".",
                  });
                } catch (e) {
                  return "";
                }
              }}
              width={40}
              fontSize="12"
              tickSize={8}
            />
            {showSeprate && (
              <YAxis
                tickFormatter={(value) =>
                  millify(value, {
                    precision: extraDecimal,
                    decimalSeparator: ".",
                  })
                }
                width={80}
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 10 }}
              ></YAxis>
            )}
            <Tooltip
              labelFormatter={(value: string) => {
                if (isNotDate || defultViewSetting === "month") {
                  return value;
                }
                if (defultViewSetting === "day") {
                  return moment(value).format("MMM DD YYYY");
                }
              }}
              labelStyle={{
                color: useColorModeValue("black", "white"),
              }}
              contentStyle={{
                backgroundColor: useColorModeValue("#f1f1f1", "black"),
                borderRadius: "5px",
              }}
              formatter={(a: any) => {
                return millify(a, {
                  precision: extraDecimal,
                  decimalSeparator: ".",
                });
              }}
            />
            <Bar
              yAxisId={showSeprate ? "right" : "left"}
              legendType="square"
              dataKey={barDataKey}
              fill={`url(#color${additionalDumpTextToAddKeyToKeyBeUnique})`}
            />

            <Area
              hide={hideLine}
              dataKey={lineDataKey}
              yAxisId="left"
              strokeWidth={"2"}
              fill={`${chartColor}20`}
            />

            {additionalLineKey != null && (
              <Line
                dataKey={additionalLineKey[0]}
                yAxisId="left"
                strokeWidth={"2"}
                stroke={`red`}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
        <AnimatePresence>
          {!isNotDate && defultViewSetting === "day" && (
            <MotionBox
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              height={"36px"}
            >
              <Box p={"1"} />
              <FilterDayBarBox
                selecteRange={selectedDate}
                onSelectLastNthDay={filterDateAccordingDay}
                onSelectRangeDay={filterDateAccordingRange}
                onResetClick={resetToAll}
                minDate={minDate!.toDate()!}
                maxDate={maxDate!.toDate()}
                filters={[
                  { day: 7, name: "7D" },
                  { day: 30, name: "30D" },
                  {
                    day:
                      Math.round(
                        (maxDate!.toDate().getTime() -
                          new Date(
                            2022,
                            0,
                            1
                          ).getTime()) /
                        (1000 * 60 * 60 * 24)
                      ) + 1,
                    name: "2022".toString(),
                  },
                  { day: 365, name: "1Y" },
                ]}
              />
            </MotionBox>
          )}
        </AnimatePresence>
      </Box>
    </GridItem>
  );
};

export default LineChartWithBar;
