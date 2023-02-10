import {
  Box,
  useColorModeValue,
  GridItem,
  MenuList,
  MenuDivider,
  CircularProgress,
  Center,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { GRID_ITEM_SIZE } from "./template";
import ChartSpanMenu from "../basic/ChartSpanMenu";
import ChartHeader from "../basic/ChartHeader";
import { ModalInfo } from "../basic/ModalInfo";
import ChartImageExportMenu from "../basic/ChartImageExportMenu";
import Chart from "react-google-charts";

interface Props {
  modelInfo?: string;
  title: string;
  infoSizePercentage?: number;
  data: any[];
  baseSpan?: number;
  additionalDumpTextToAddKeyToKeyBeUnique?: string;
  customColor?: string;
  oyLabel?: string;
  disclaimer?: string;
}

const ChartBox = ({
  baseSpan = 1,
  disclaimer,
  data,
  title,
  modelInfo = "",
  infoSizePercentage = 50,
  additionalDumpTextToAddKeyToKeyBeUnique = "",
  customColor = "var(--chakra-colors-green-300)",
}: Props) => {
  const chartRef = useRef<null | HTMLDivElement>(null);
  const [spanItem, setSpanItem] = useState(GRID_ITEM_SIZE[baseSpan - 1]);

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
          disclaimer={disclaimer}
          chartMenu={
            <MenuList
              data-html2canvas-ignore
              bg={useColorModeValue("white", "#232323")}
            >
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
          modalInfo={""}
          title={title}
        />
        <Box p={"1"} />
        <Chart
          chartType="CandlestickChart"
          width={"100%"}
          height="420px"
          loader={
            <Center>
              <CircularProgress />
            </Center>
          }
          data={data}
          options={{
            legend: "none",
            bar: { groupWidth: "100%" },
            backgroundColor: useColorModeValue("white", "#191919"),
            colors: [
              useColorModeValue("#191919", "white"),
              useColorModeValue("#191919", "white"),
            ],
            hAxis: {
              textColor: useColorModeValue("#191919", "white"),
            },
            vAxis: {
              textColor: useColorModeValue("#191919", "white"),
              size: "4px",
            },
            candlestick: {
              width: "100%",
              height: "100%",
              fallingColor: { strokeWidth: 0, fill: "#a52714" },
              risingColor: { strokeWidth: 0, fill: "#0f9d58" },
            },
          }}
        />
      </Box>
    </GridItem>
  );
};

export default ChartBox;
