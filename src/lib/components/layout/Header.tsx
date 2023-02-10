import { Box, Flex, Heading } from "@chakra-ui/react";
import names from "lib/utility/names";
import Link from "next/link";

const Header = () => {
  return (
    <Flex as="header" width="full" align="center">
      <Heading as="h1" size="md">
        <Link href="/">{names.APP_NAME}</Link>
      </Heading>

      <Box marginLeft="auto">{/* <ThemeToggle /> */}</Box>
    </Flex>
  );
};

export default Header;
