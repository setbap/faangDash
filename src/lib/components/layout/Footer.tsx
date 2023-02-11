import {
  Box,
  Container,
  Link,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";
import { MetricsDoa } from "../basic/FlipSideIcon";

export default function Footer() {
  const baseColor = useColorModeValue("gray.700", "whiteAlpha.700");
  return (
    <Box
      fontSize={{ base: "0.7rem", md: "1rem" }}
      borderTopRadius="lg"
      bg={useColorModeValue("white", "#191919")}
      color={baseColor}
    >
      <Container
        as={Stack}
        maxW={"100vw"}
        py={4}
        direction={"row"}
        spacing={4}
        justify={{ base: "center", md: "end" }}
        align={{ base: "center", md: "center" }}
      >
        <Stack direction={"row"} spacing={2}>
          <Text>Powered by</Text>

          <Link
            style={{ marginInlineStart: "0.25em" }}
            href={"https://metricsdao.xyz/"}
            isExternal
            display={"inline-flex"}
          >
            Metrics Dao{" "}
            <Box style={{ marginTop: "-0.05em" }} ml={"1"}>
              <MetricsDoa />
            </Box>
          </Link>

          <Text style={{ marginInlineStart: "0.3em" }}>&</Text>
          <Link
            style={{ marginInlineStart: "0.25em" }}
            href={"http://github.com/setbap/faangdash"}
            isExternal
            display={"inline-flex"}
          >
            SetBap{" (source code) "}
            <Box mt={"1"} ml={"1"}>
              <FaGithub />
            </Box>
          </Link>
        </Stack>
      </Container>
    </Box>
  );
}
