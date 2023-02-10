import React, { Fragment, useRef, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Label,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  ReferenceLine,
} from "recharts";
import {
  Box,
  useColorModeValue,
  GridItem,
  MenuList,
  MenuDivider,
  MenuItemOption,
  MenuOptionGroup,
} from "@chakra-ui/react";
import millify from "millify";
import moment from "moment";
import { GRID_ITEM_SIZE } from "./template";
import ChartSpanMenu from "../basic/ChartSpanMenu";
import ChartHeader from "../basic/ChartHeader";
import LinkToSourceMenuItem from "../basic/LinkToSourceMenuItem";
import { ModalInfo } from "../basic/ModalInfo";
import ChartImageExportMenu from "../basic/ChartImageExportMenu";

const BarGraph = ({
  title,
  dataKey,
  oyLabel = "",
  values,
  baseSpan = 1,
  labels,
  modalInfo,
  isNotDate = false,
  monthlyValues,
  extraInfoToTooltip,
  defualtTime = "day",
  queryLink,
  disclaimer,
  isSeprate = false,
  seprateNegetive = false,
  infoSizePercentage = 50,
  hideLegend = false,
}: {
  seprateNegetive?: boolean;
  hideLegend?: boolean;
  defualtTime?: "day" | "month";
  title: string;
  disclaimer?: string;
  dataKey: string;
  oxLabel?: string;
  oyLabel?: string;
  isNotDate?: boolean;
  monthlyValues?: any[];
  values: any[];
  modalInfo: string;
  baseSpan?: number;
  isSeprate?: boolean;
  queryLink?: string;
  extraInfoToTooltip?: string;
  labels: { key: string; color: string }[];
  infoSizePercentage?: number | "full";
}) => {
  const hasMonthly = !isNotDate && monthlyValues && monthlyValues.length > 0;
  const [chartData, setChartData] = useState(
    defualtTime === "day" ? values : monthlyValues
  );
  const [chartTimeFrame, setChartTimeFrame] = useState<"day" | "month">(
    defualtTime
  );
  const chartRef = useRef<null | HTMLDivElement>(null);
  const [spanItem, setSpanItem] = useState(GRID_ITEM_SIZE[baseSpan - 1]);
  const [barProps, setBarProps] = useState(
    labels.reduce(
      (a: any, { key }: any) => {
        a[key] = false;
        return a;
      },
      { hover: null }
    )
  );
  const bgTooltip = useColorModeValue("gray.300", "gray.700");
  const bgCard = useColorModeValue("white", "#191919");
  const textColor = useColorModeValue("gray.900", "gray.100");

  const handleLegendMouseEnter = (e: any) => {
    if (!barProps[e.dataKey]) {
      setBarProps({ ...barProps, hover: e.dataKey });
    }
  };

  const handleLegendMouseLeave = (_: never) => {
    setBarProps({ ...barProps, hover: null });
  };

  const selectBar = (e: any) => {
    const numberOfBars = Object.keys(barProps).length - 1;
    const numberOfHideBars = Object.entries(barProps).filter(
      ([, value]) => value == true
    ).length;

    if (numberOfBars === numberOfHideBars + 1 && !barProps[e.dataKey]) {
      const newBarProps = { ...barProps };
      // change all keys to true
      Object.keys(newBarProps).forEach((key) => {
        if (key === "hover") {
          newBarProps[key] = null;
        } else {
          newBarProps[key] = false;
        }
      });
      setBarProps(newBarProps);
      return;
    }
    setBarProps({
      ...barProps,
      [e.dataKey]: !barProps[e.dataKey],
      hover: null,
    });
  };

  const changeDataToMonethly = () => {
    setChartTimeFrame("month");
    setChartData(monthlyValues!);
  };

  const changeDataToDaily = () => {
    setChartTimeFrame("day");
    setChartData(values);
  };

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
      minHeight="auto"
      display="flex"
      flex={2}
      flexDir={
        spanItem["2xl"] !== 3 || infoSizePercentage === "full"
          ? "column-reverse"
          : ["column-reverse", "column-reverse", "column-reverse", "row", "row"]
      }
    >
      <ModalInfo
        modalInfo={modalInfo}
        infoSizePercentage={infoSizePercentage}
        largeSpanSize={baseSpan}
      />

      <Box
        flex={1}
        px="4"
        pt="4"
        pb={"2"}
        _hover={{ boxShadow: `0px 0px 4px ${bgTooltip}` }}
        display="flex"
        flexDir={"column"}
        alignItems="center"
        height={"480px"}
        id={title}
      >
        <ChartHeader
          disclaimer={disclaimer}
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
              {hasMonthly && (
                <>
                  <MenuOptionGroup
                    onChange={(value) => {
                      if (value === "month") {
                        changeDataToMonethly();
                      } else {
                        changeDataToDaily();
                      }
                    }}
                    defaultValue={chartTimeFrame}
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
          modalInfo={modalInfo}
          title={title}
        />
        <Box p={"1"} />
        <ResponsiveContainer height={425} width={"100%"}>
          <BarChart data={chartData} className="mt-1 mb-2">
            <CartesianGrid
              style={{ stroke: "rgba(110,110,110,1)", opacity: 0.15 }}
              strokeDasharray="3 3"
            />
            <XAxis
              fontSize={"12px"}
              tickFormatter={(value: string) => {
                if (isNotDate) {
                  return value;
                }
                if (chartTimeFrame === "month") {
                  return moment(value).format("MMM YYYY");
                }
                return moment(value).format("MMM DD YYYY");
              }}
              dataKey={dataKey}
            >
              {/* <Label value={oxLabel} position="center" dy={10} dx={20} /> */}
            </XAxis>
            <YAxis
              fontSize={"12px"}
              type="number"
              tickFormatter={(value) =>
                millify(value, {
                  precision: 2,
                  decimalSeparator: ".",
                })
              }
            >
              <Label
                value={oyLabel}
                position="left"
                fontSize={"16px"}
                angle={-90}
                dy={-20}
                fill={"gray"}
                style={{
                  color: textColor,
                }}
                dx={10}
              />
            </YAxis>
            <Tooltip
              wrapperStyle={{ zIndex: 10 }}
              labelFormatter={(value: string) => {
                if (isNotDate) {
                  return value;
                }

                if (chartTimeFrame === "month") {
                  return moment(value).format("MMM YYYY");
                }
                return moment(value).format("MMM DD YYYY");
              }}
              labelStyle={{
                color: useColorModeValue("black", "white"),
              }}
              contentStyle={{
                backgroundColor: useColorModeValue("#f1f1f1", "black"),
                borderRadius: "5px",
              }}
              formatter={(a: any) => {
                return (
                  millify(a, {
                    precision: 2,
                    decimalSeparator: ".",
                  }) + `${extraInfoToTooltip ?? ""}`
                );
              }}
            />
            {!hideLegend && (
              <Legend
                fontSize={"8px"}
                height={40}
                overflow="hidden"
                style={{ fontSize: "7px", position: "relative" }}
                onClick={selectBar}
                onMouseOver={handleLegendMouseEnter}
                onMouseOut={handleLegendMouseLeave}
              />
            )}
            {labels.map((label, index) => (
              <Fragment key={index}>
                <defs>
                  <linearGradient
                    id={`color${index}bargraph`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      style={{ stopColor: label.color }}
                      stopOpacity={0.5}
                    />
                    <stop
                      offset="95%"
                      style={{ stopColor: label.color }}
                      stopOpacity={0.2}
                    />
                  </linearGradient>
                </defs>
                {seprateNegetive && <ReferenceLine y={0} stroke="#a9a9a9" />}
                <Bar
                  key={index}
                  dataKey={label.key}
                  // stroke={labels[index].color}
                  fill={label.color}
                  stackId={isSeprate ? index : dataKey}
                  hide={barProps[label.key] === true}
                  fillOpacity={Number(
                    barProps.hover === label.key || !barProps.hover ? 1 : 0.6
                  )}
                >
                  {seprateNegetive &&
                    chartData!.map((entry, index) => (
                      <Cell
                        fill={entry[label.key] > 0 ? label.color : "#f00"}
                      />
                    ))}
                </Bar>
              </Fragment>
            ))}
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </GridItem>
  );
};

export default BarGraph;
