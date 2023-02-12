import {
  AspectRatio,
  Box,
  GridItem,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import Link from "next/link";
import React, { FC } from "react";
import MDRenderer from "./MDRenderer";

function CompanyLinkBox({
  path,
  Icon,
  hoverColor,
}: {
  path: string;
  Icon: FC;
  hoverColor: string;
}) {
  const { colorMode } = useColorMode();
  const bgCard = useColorModeValue("white", "#191919");
  const textColor = useColorModeValue("gray.900", "gray.100");
  return (
    <AspectRatio as={Link} href={path.toLowerCase()} ratio={1}>
      <GridItem
        rowSpan={1}
        className={colorMode === "dark" ? "gradient-box" : "gradient-box-light"}
        color={textColor}
        bgColor={bgCard}
        shadow="base"
        transition={"all 0.5s "}
        border={"2px solid transparent"}
        _hover={{
          boxShadow: "var(--chakra-shadows-lg)",
          borderColor: "#444",
          color: hoverColor,
        }}
        borderRadius={"2xl"}
        width="100%"
        colSpan={1}
      >
        <Box
          textAlign={"center"}
          fontSize={["2xl", "4xl", "4xl", "5xl", "6xl"]}
          px="4"
          pb="3"
          pt={"1"}
          display="flex"
          flexDir={"column"}
          justifyContent={"center"}
          alignItems="center"
          gap={"6"}
        >
          <Icon />

          <Box
            fontWeight={"bold"}
            fontSize={["xl", "2xl", "3xl", "4xl", "5xl"]}
          >
            {path}
          </Box>
        </Box>
      </GridItem>
    </AspectRatio>
  );
}

export default CompanyLinkBox;
