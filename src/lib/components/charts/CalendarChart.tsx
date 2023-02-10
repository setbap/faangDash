import {
  Box,
  useColorModeValue,
  GridItem,
  MenuList,
  MenuDivider,
  ButtonGroup,
  Button,
} from "@chakra-ui/react";
import { ResponsiveCalendar } from "@nivo/calendar";

import { useRef, useState } from "react";
import moment from "moment";

import { GRID_ITEM_SIZE } from "./template";
import ChartSpanMenu from "../basic/ChartSpanMenu";
import ChartHeader from "../basic/ChartHeader";
import { AnimatePresence } from "framer-motion";
import MotionBox from "../motion/Box";
import LinkToSourceMenuItem from "../basic/LinkToSourceMenuItem";
import { ModalInfo } from "../basic/ModalInfo";
import ChartImageExportMenu from "../basic/ChartImageExportMenu";

interface Props {
  modalInfo?: string;
  xAxisDataKey: string;
  areaDataKey: string;
  title: string;
  tooltipTitle: string;
  data: any[];
  extraDecimal?: number;
  isNotDate?: boolean;
  domain?: [number, number];
  baseSpan?: number;
  defultSelectedRange?: number | string;
  defultDateView?: "month" | "day";
  queryLink?: string;
  disclaimer?: string;
  additionalDumpTextToAddKeyToKeyBeUnique?: string;
  customColor?: string;
  years: number[];
  selectedYear: number;
  infoSizePercentage?: number | "full";
}

const CalendarChart = ({
  years = [2021, 2022],
  selectedYear = 2022,
  baseSpan = 1,
  defultDateView = "day",
  queryLink,
  isNotDate = false,
  areaDataKey,
  xAxisDataKey,
  disclaimer,
  data,
  title,
  modalInfo = "",
  infoSizePercentage = 50,
}: Props) => {
  const chartRef = useRef<null | HTMLDivElement>(null);
  const [spanItem, setSpanItem] = useState(GRID_ITEM_SIZE[baseSpan - 1]);
  const [defultViewSetting, setDefultViewSetting] = useState(defultDateView);
  const [selectedDate, setSelectedDate] = useState<number | string>(
    selectedYear
  );
  const [chartData, setChartData] = useState(
    data.filter((item) => {
      return moment(item[xAxisDataKey]).year() === selectedYear;
    })
  );
  const filterDateAccordingYear = (year: number) => {
    const newData = data.filter((item) => {
      return moment(item[xAxisDataKey]).year() === year;
    });
    setSelectedDate(year);
    setChartData(newData);
  };

  const bgTooltip = useColorModeValue("gray.300", "gray.700");
  const bgCard = useColorModeValue("white", "#191919");
  const textColor = useColorModeValue("gray.900", "gray.100");

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
        modalInfo={modalInfo}
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
        <Box p={"0"} />
        <Box height={425} width="full">
          <ResponsiveCalendar
            data={chartData.map((d: any) => ({
              value: d[areaDataKey],
              day: moment(d[xAxisDataKey]).format("YYYY-MM-DD"),
            }))}
            from={moment(`${+selectedDate}-01-01`).toDate()}
            to={moment(`${+selectedDate + 1}-01-01`)
              .subtract(1, "day")
              .toDate()}
            emptyColor="#aaa2"
            colors={[
              "#cfc",
              "#bfb",
              "#afa",
              "#9f9",
              "#8f8",
              "#7f7",
              "#6f6",
              "#5f5",
              "#4f4",
              "#3f3",
              "#2f2",
              "#1f1",
              "#0f0",
            ]}
            yearSpacing={0}
            monthBorderColor="transparent"
            dayBorderWidth={0}
            monthSpacing={16}
            yearLegendOffset={9}
            minValue="auto"
            maxValue={"auto"}
            monthBorderWidth={0}
            daySpacing={4}
            dayBorderColor="transparent"
            theme={{
              background: "transparent",
              textColor: "white",
              axis: {
                legend: {
                  text: {
                    fill: "black",
                  },
                },
              },
              tooltip: {
                container: {
                  background: "#232323",

                  fontSize: 15,
                },
              },
            }}
            legends={[
              {
                anchor: "bottom-right",
                direction: "row",
                translateY: 36,
                itemCount: 2,
                itemWidth: 42,
                itemTextColor: "white",
                itemHeight: 36,

                itemsSpacing: 14,
                itemDirection: "right-to-left",
              },
            ]}
          />
        </Box>

        <AnimatePresence>
          {!isNotDate && defultViewSetting === "day" && (
            <MotionBox
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              height={"36px"}
            >
              <Box p={"1"} />
              <Box height={"36px"}>
                <ButtonGroup size={"xs"} variant="outline" spacing={1}>
                  {years.map((yaer) => (
                    <Button
                      variant={selectedDate === yaer ? "solid" : "outline"}
                      onClick={() => filterDateAccordingYear(yaer)}
                    >
                      {yaer}
                    </Button>
                  ))}
                </ButtonGroup>
              </Box>
            </MotionBox>
          )}
        </AnimatePresence>
      </Box>
    </GridItem>
  );
};

export default CalendarChart;
