import {
  Box,
  GridItem,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import MDRenderer from "../basic/MDRenderer";
import { GRID_ITEM_SIZE } from "./template";

const TextBox = ({ children, hasPattern = false, spanSize = 3 }: any) => {
  const bgCard = useColorModeValue("white", "#191919");
  const textColor = useColorModeValue("gray.900", "gray.100");
  const { colorMode } = useColorMode();

  return (
    <GridItem
      rowSpan={1}
      className={
        hasPattern && colorMode === "dark"
          ? "gradient-box"
          : "gradient-box-light"
      }
      color={textColor}
      bgColor={bgCard}
      shadow="base"
      transition={"all 0.5s "}
      border={"2px solid transparent"}
      _hover={{ boxShadow: "var(--chakra-shadows-lg)", borderColor: "#444" }}
      borderRadius={"2xl"}
      width="100%"
      colSpan={GRID_ITEM_SIZE[spanSize - 1]}
    >
      <Box px="4" pb="3" pt={"1"}>
        <MDRenderer>{children}</MDRenderer>
      </Box>
    </GridItem>
  );
};

export default TextBox;
