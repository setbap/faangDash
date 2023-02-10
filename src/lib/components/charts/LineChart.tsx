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
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
} from "recharts";
import { GRID_ITEM_SIZE } from "./template";
import ChartSpanMenu from "../basic/ChartSpanMenu";
import ChartHeader from "../basic/ChartHeader";
import { FilterDayBarBox } from "../basic/FilterDayBar";
import { AnimatePresence } from "framer-motion";
import MotionBox from "../motion/Box";
import LinkToSourceMenuItem from "../basic/LinkToSourceMenuItem";
import TrendLine from "./TrendLine";
import { ModalInfo } from "../basic/ModalInfo";
import ChartImageExportMenu from "../basic/ChartImageExportMenu";

interface Props {
  modelInfo?: string;
  xAxisDataKey: string;
  areaDataKey: string;
  title: string;
  infoSizePercentage?: number;
  data: any[];
  extraDecimal?: number;
  isNotDate?: boolean;
  domain?: [number, number];
  baseSpan?: number;
  defultSelectedRange?: number | string;
  defultDateView?: "month" | "day";
  showMonthly?: boolean;
  queryLink?: string;
  additionalDumpTextToAddKeyToKeyBeUnique?: string;
  customColor?: string;
  oyLabel?: string;
}

const ChartBox = ({
  baseSpan = 1,
  oyLabel = "",
  defultDateView = "day",
  queryLink,
  isNotDate = false,
  extraDecimal = 2,
  domain,
  areaDataKey,
  xAxisDataKey,
  data,
  title,
  modelInfo = "",
  infoSizePercentage = 50,
  additionalDumpTextToAddKeyToKeyBeUnique = "",
  defultSelectedRange = 2022,
  showMonthly = false,
  customColor = "var(--chakra-colors-green-300)",
}: Props) => {
  const chartRef = useRef<null | HTMLDivElement>(null);
  const [spanItem, setSpanItem] = useState(GRID_ITEM_SIZE[baseSpan - 1]);
  const [defultViewSetting, setDefultViewSetting] = useState(defultDateView);
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
  const [selectedDate, setSelectedDate] = useState<number | string>(
    isNotDate
      ? ""
      : defultSelectedRange === 2022 ?
        Math.round(
          (maxDate!.toDate().getTime() - new Date(2022, 0, 1).getTime()) / (1000 * 60 * 60 * 24)
        ) + 1 : 'all'
  );
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

  const changeDataToMonethly = () => {
    const newData: { [key: string]: number[] } = {};
    data.forEach((item) => {
      const monthName: string = moment(item[xAxisDataKey]).format("MMM YYYY");
      if (newData[monthName] === undefined) {
        newData[monthName] = [];
      }
      newData[monthName].push(item[areaDataKey]);
    });
    setDefultViewSetting("month");
    setSavedDailyChart(chartData);
    setChartData(
      Object.entries(newData).map(([key, value]) => {
        return {
          [xAxisDataKey]: key,
          [areaDataKey]: value.reduce((a, b) => a + b, 0),
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

  const resetChartData = () => {
    if (isNotDate) {
      return;
    }
    if (defultSelectedRange === 'all') {
      setChartData(data)
      setSelectedDate('all')
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

  const bgTooltip = useColorModeValue("gray.300", "gray.700");
  const bgCard = useColorModeValue("white", "#191919");
  const textColor = useColorModeValue("gray.900", "gray.100");
  const chartColor = customColor;
  const chartUniquKey = `${areaDataKey}-${xAxisDataKey}-${additionalDumpTextToAddKeyToKeyBeUnique}`;

  useEffect(() => {
    resetChartData();
  }, []);

  const resetToAll = () => {
    setChartData(data)
    setSelectedDate('all')
    return;
  }

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
        spanItem["2xl"] !== 3
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
          modalInfo={""}
          title={title}
        />
        <Box p={"1"} />
        <ResponsiveContainer
          height={!isNotDate && defultViewSetting === "day" ? 380 : 425}
          width={"100%"}
        >
          <AreaChart
            data={chartData}
            syncId={chartUniquKey}
            className="mt-1 mb-1"
          >
            <defs>
              <linearGradient
                id={`color${additionalDumpTextToAddKeyToKeyBeUnique}box`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  style={{ stopColor: chartColor }}
                  stopOpacity={0.7}
                />
                <stop
                  offset="95%"
                  style={{ stopColor: chartColor }}
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              style={{ stroke: "rgba(110,110,110,1)", opacity: 0.15 }}
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
              domain={domain}
              tickFormatter={(value) =>
                millify(value, {
                  precision: extraDecimal,
                  decimalSeparator: ".",
                })
              }
              width={48}
              fontSize="12"
              tickSize={8}
            >
              <Label
                value={oyLabel}
                position="left"
                fontSize={"16px"}
                angle={-90}
                dy={-10}
                fill={"gray"}
                style={{
                  color: textColor,
                }}
                dx={6}
                z={100}
              />
            </YAxis>

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
            <TrendLine
              data={chartData}
              xKey={xAxisDataKey}
              yKey={areaDataKey}
            />
            <Area
              dataKey={areaDataKey}
              stroke={customColor}
              fill={`url(#color${additionalDumpTextToAddKeyToKeyBeUnique}box)`}
            />

            {/* <Legend
              verticalAlign="top"
              fontSize={"8px"}
              style={{ fontSize: "7px" }}
            /> */}
          </AreaChart>
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

export default ChartBox;
