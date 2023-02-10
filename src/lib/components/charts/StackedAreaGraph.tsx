import React, { useRef, useState } from "react";
import {
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Label,
  ResponsiveContainer,
  CartesianGrid,
  Area,
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

const StackedAreaChart = ({
  title,
  dataKey,
  oxLabel,
  oyLabel,
  values,
  baseSpan = 1,
  labels,
  modalInfo,
  isNotDate = false,
  monthlyValues,
  extraInfoToTooltip,
  defaultTime = "day",
  queryLink,
  dataPrecision = 2,
  infoSizePercentage = 50,
}: {
  defaultTime?: "day" | "month";
  title: string;
  dataKey: string;
  oxLabel: string;
  oyLabel: string;
  isNotDate?: boolean;
  monthlyValues?: any[];
  values: any[];
  modalInfo: string;
  baseSpan?: number;
  queryLink?: string;
  extraInfoToTooltip?: string;
  dataPrecision?: number;
  labels: { key: string; color: string }[];
  infoSizePercentage?: number | "full";
}) => {
  const chartRef = useRef<null | HTMLDivElement>(null);
  const hasMonthly = !isNotDate && monthlyValues && monthlyValues.length > 0;
  const [chartData, setChartData] = useState(
    defaultTime === "day" ? values : monthlyValues
  );
  const [chartTimeFrame, setChartTimeFrame] = useState<"day" | "month">(
    defaultTime
  );
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
      ([key, value]) => value == true
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
      colSpan={spanItem}
      color={textColor}
      bgColor={bgCard}
      shadow="base"
      transition={"all 0.5s "}
      border={"2px solid transparent"}
      _hover={{ boxShadow: "var(--chakra-shadows-lg)", borderColor: "#444" }}
      borderRadius={"2xl"}
      width="100%"
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

        <ResponsiveContainer width={"100%"}>
          <AreaChart data={chartData} className="mt-1 mb-2">
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
                  precision: dataPrecision,
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
                    precision: dataPrecision,
                    decimalSeparator: ".",
                  }) + `${extraInfoToTooltip ?? ""}`
                );
              }}
            />

            <Legend
              fontSize={"8px"}
              iconType="circle"
              style={{ fontSize: "7px", position: "relative" }}
              onClick={selectBar}
              onMouseOver={handleLegendMouseEnter}
              onMouseOut={handleLegendMouseLeave}
            />
            {labels.map((label, index) => (
              <Area
                type="monotone"
                key={index}
                dataKey={label.key}
                fill={label.color}
                stroke={label.color}
                stackId={index}
                hide={barProps[label.key] === true}
                fillOpacity={Number(
                  barProps.hover === label.key || !barProps.hover ? 0.3 : 0.1
                )}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </GridItem>
  );
};

export default StackedAreaChart;
