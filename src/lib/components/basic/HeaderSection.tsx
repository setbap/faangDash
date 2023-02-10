import {
  Box,
  GridItem,
  Heading,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import { GRID_ITEM_SIZE } from "../charts/template";
import MDRenderer from "./MDRenderer";

const HeaderSection = ({
  children,
  spanSize = 3,
  title,
}: {
  title: string;
  children?: ReactNode;
  spanSize?: number;
}) => {
  const bgCard = useColorModeValue("white", "#191919");
  const textColor = useColorModeValue("gray.900", "gray.100");
  const { colorMode } = useColorMode();
  return (
    <GridItem
      rowSpan={1}
      className={colorMode === "dark" ? "gradient-box" : "gradient-box-light"}
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
        <Heading as="h2" size={"xl"} py={"1.5"} id={title} data-section>
          {title}
        </Heading>
        <MDRenderer>{children}</MDRenderer>
      </Box>
    </GridItem>
  );
};

export default HeaderSection;
