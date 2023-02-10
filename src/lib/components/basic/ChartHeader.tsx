import { Box, IconButton, chakra, Menu, MenuButton } from "@chakra-ui/react";
import { FiSettings } from "react-icons/fi";

export default function ChartHeader({
  title,
  chartMenu,
  disclaimer,
}: {
  disclaimer?: string;
  modalInfo: string;
  title: string;
  chartMenu: any;
}) {
  return (
    <Box
      width={"100%"}
      display={"flex"}
      alignItems="center"
      justifyContent={"space-between"}
    >
      <Box width={"4"} />
      <Box mb={"2"}>
        <chakra.h6
          height="7"
          textAlign={"center"}
          noOfLines={1}
          textOverflow="ellipsis"
        >
          {title}
        </chakra.h6>
        {disclaimer && <chakra.sub>{disclaimer}</chakra.sub>}
      </Box>
      <Box w={"4"}>
        <Menu closeOnSelect={false}>
          <MenuButton
            data-html2canvas-ignore
            size={"sm"}
            as={IconButton}
            aria-label="Options"
            icon={<FiSettings />}
            variant="outline"
          />
          {chartMenu}
        </Menu>
      </Box>
    </Box>
  );
}
