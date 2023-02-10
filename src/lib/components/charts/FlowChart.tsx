import {
  Box,
  useColorModeValue,
  GridItem,
  MenuList,
  MenuDivider,
} from "@chakra-ui/react";
import { ResponsiveSankey } from "@nivo/sankey";
import { useRef, useState } from "react";
import { GRID_ITEM_SIZE } from "./template";
import ChartSpanMenu from "../basic/ChartSpanMenu";
import ChartHeader from "../basic/ChartHeader";
import LinkToSourceMenuItem from "../basic/LinkToSourceMenuItem";
import { ModalInfo } from "../basic/ModalInfo";
import ChartImageExportMenu from "../basic/ChartImageExportMenu";

export interface ISankeyChart {
  nodes: {
    id: string;
    color: string;
  }[];
  links: {
    source: string;
    target: string;
    value: number;
  }[];
}
interface Props {
  modalInfo: string;
  title: string;
  tooltipTitle: string;
  data: ISankeyChart;
  baseSpan?: number;
  queryLink?: string;
  customColor?: string;
  infoSizePercentage?: number | "full";
}

const FlowChart = ({
  baseSpan = 1,
  queryLink,
  data,
  title,
  modalInfo,
  infoSizePercentage = 50,
  customColor = "var(--chakra-colors-green-300)",
}: Props) => {
  const [spanItem, setSpanItem] = useState(GRID_ITEM_SIZE[baseSpan - 1]);
  const chartRef = useRef<null | HTMLDivElement>(null);
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
        <Box height={"380px"} p={"0"}>
          <ResponsiveSankey
            data={data}
            margin={{ top: 32, right: 32, bottom: 32, left: 32 }}
            sort="input"
            colors={{ scheme: "paired" }}
            nodeOpacity={1}
            nodeHoverOthersOpacity={0.6}
            nodeThickness={28}
            nodeInnerPadding={2}
            nodeSpacing={38}
            nodeBorderWidth={3}
            nodeBorderColor="#4444"
            nodeBorderRadius={3}
            linkOpacity={1}
            linkHoverOpacity={0.8}
            linkHoverOthersOpacity={0.1}
            linkContract={2}
            linkBlendMode="lighten"
            enableLinkGradient={true}
            labelPosition="outside"
            labelPadding={14}
            labelOrientation="vertical"
            labelTextColor="#ffffff"
            valueFormat=" >-.2f"
            legends={[
              {
                anchor: "bottom-right",
                direction: "column",
                translateX: 130,
                itemWidth: 100,
                itemHeight: 14,
                itemDirection: "right-to-left",
                itemsSpacing: 2,
                itemTextColor: "#999",
                symbolSize: 14,
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemTextColor: "#000",
                    },
                  },
                ],
              },
            ]}
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
          />
        </Box>
      </Box>
    </GridItem>
  );
};

export default FlowChart;
