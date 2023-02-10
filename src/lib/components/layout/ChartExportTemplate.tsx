import {
  Text,
  Box,
  Heading,
  Link,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import names from "lib/utility/names";
import React from "react";
import { FlipSideIcon, MetricsDoa } from "lib/components/basic/FlipSideIcon";
import { FaGithub } from "react-icons/fa";

function Template({ header = "" }: { header?: string }) {
  const footer = `Check out more info at ${names.SITE_URL}`;
  return (
    <Box border={"2px"} mx="auto" p={"4"} width="1600px" height={"900px"}>
      <Box
        p="4"
        width={"full"}
        height="full"
        borderRadius={"2xl"}
        bg={names.BLOCKCHAIN_HEADER_GRADIENT}
      >
        <Box
          width={"full"}
          height="full"
          borderRadius={"2xl"}
          className="box"
          p="2"
          bg={useColorModeValue("gray.100", "#191919")}
        >
          <Box
            py={"2"}
            display={"inline-flex"}
            justifyContent="center"
            alignItems={"center"}
            textAlign="center"
            width={"full"}
          >
            <Heading textAlign={"center"}>{header}</Heading>
            <Box px={"3"}>{"|"}</Box>
            <span
              style={{
                color: useColorModeValue("green", "cyan"),
                textDecoration: `${useColorModeValue(
                  "green",
                  "cyan"
                )} wavy underline`,
              }}
            >
              {footer}
            </span>
          </Box>
          <Box
            width={1500}
            bg="gray.200"
            mx={"auto"}
            height={720}
            className="template"
          />
          <Box py={"3"}>
            <Stack direction={"row"} justifyContent="center" spacing={2}>
              <Text>Powered by</Text>
              <Link
                style={{ marginInlineStart: "0.25em" }}
                href={"https://flipsidecrypto.xyz/"}
                isExternal
                display={"inline-flex"}
              >
                Flipside Crypto{" "}
                <Box style={{ marginTop: "-0.05em" }} ml={"1"}>
                  <FlipSideIcon fill={useColorModeValue("black", "white")} />
                </Box>
              </Link>
              <Text style={{ marginInlineStart: "0.3em" }}>&</Text>
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
                href={"http://github.com/setbap"}
                isExternal
                display={"inline-flex"}
              >
                SetBap{" "}
                <Box mt={"1"} ml={"1"}>
                  <FaGithub />
                </Box>
              </Link>
            </Stack>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Template;
