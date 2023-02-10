import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { BiChevronDown } from "react-icons/bi";
import useHeaderLink from "../hooks/useHeaderLink";

function CurrentStatusPage() {
  const { sectionText } = useHeaderLink();
  const [allSections, setAllSections] = useState<string[]>([]);
  useEffect(() => {
    const elements = document.querySelectorAll("[data-type]");
    const data: string[] = [];
    elements.forEach((element: any) => data.push(element.dataset.id));
    setAllSections(allSections);
  }, [sectionText]);
  const bgCard = useColorModeValue("white", "#191919");
  const scrollToItem = (item: string) => {
    var element = document.getElementById(item);

    element?.scrollIntoView({ behavior: "smooth", block: "start" });
    if (element === null) {
      return;
    }
    const y = element?.getBoundingClientRect().top + window.pageYOffset - 140;

    window.scrollTo({ top: y, behavior: "smooth" });
  };
  return (
    <Menu isLazy strategy="fixed">
      <MenuButton
        as={Button}
        type="button"
        size="sm"
        fontSize={"md"}
        fontWeight="bold"
        position={"sticky"}
        style={{ fontFamily: "'Carter One', cursive" }}
        display={"inline-flex"}
        flexDir={"row"}
      >
        <Box maxW={"64"} display={"inline-flex"}>
          <Box pr="2" noOfLines={1} textOverflow="ellipsis">
            {sectionText}
          </Box>
          <BiChevronDown display={"inline-flex"} />
        </Box>
      </MenuButton>
      <MenuList bg={bgCard}>
        {typeof window !== "undefined" &&
          Array.from(document.querySelectorAll("[data-section]")).map(
            (section: any) => (
              <MenuItem
                onClick={() => scrollToItem(section.id)}
                fontSize={"md"}
                _hover={{
                  bg: useColorModeValue("#eee", "#282828"),
                }}
                bg={useColorModeValue("white", "#191919")}
                key={section.id}
              >
                {section.id}
              </MenuItem>
            )
          )}
      </MenuList>
    </Menu>
  );
}

export default CurrentStatusPage;
