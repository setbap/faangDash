import { Link, MenuItem, useColorModeValue } from "@chakra-ui/react";
import React from "react";
import { FiExternalLink } from "react-icons/fi";

function LinkToSourceMenuItem({ queryLink }: { queryLink: string }) {
  return (
    <MenuItem
      _hover={{
        bg: useColorModeValue("#eee", "#191919"),
      }}
      bg={useColorModeValue("white", "#232323")}
      icon={<FiExternalLink />}
      as={Link}
      href={`https://app.flipsidecrypto.com/velocity/queries/${queryLink}`}
      isExternal
    >
      Open Query Detail
    </MenuItem>
  );
}

export default LinkToSourceMenuItem;
