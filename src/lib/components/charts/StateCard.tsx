import {
  Box,
  Flex,
  IconButton,
  Link,
  Stat,
  StatLabel,
  StatNumber,
  Tooltip,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import millify from "millify";
import { useEffect, useState } from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { FiExternalLink } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import Renderer from "chakra-ui-markdown-renderer";
import { HiArrowSmUp } from "react-icons/hi";

interface StatsCardProps {
  title: string;
  stat: number | string;
  status?: "inc" | "dec" | "unchanged" | "custom";
  link?: string;
  isExternalLink?: boolean;
  comment?: string;
  unit?: string;
  decimal?: number;
  forceDecimal?: boolean;
  customColor?: string;
  top?: number | string;
  hasArrowIcon?: boolean;
  rotate?: string;
  change?: number;
  changeUnit?: string;
}
export const StatsCard = (props: StatsCardProps) => {
  const bgCard = useColorModeValue("#ffff", "#191919");
  const {
    title,
    change = null,
    hasArrowIcon = true,
    rotate = "0deg",
    top = "20%",
    isExternalLink = false,
    stat,
    status = "unchanged",
    forceDecimal = false,
    customColor = "#ec5f7e",
    decimal = 2,
    changeUnit = "%",
  } = props;
  const defaultColor = useColorModeValue("gray.600", "gray.400");
  const incColor = useColorModeValue("green.600", "green.300");
  const decColor = useColorModeValue("red.600", "red.300");
  const { colorMode } = useColorMode();
  const [statusColor, setStatusColor] = useState<any>();
  useEffect(() => {
    if (
      (status === "inc" && statusColor !== incColor) ||
      +(change ?? "0") > 0
    ) {
      setStatusColor(incColor);
    }
    if (
      (status === "dec" && statusColor !== decColor) ||
      +(change ?? "0") < 0
    ) {
      setStatusColor(decColor);
    }
    if (status === "unchanged" && statusColor !== defaultColor) {
      setStatusColor(defaultColor);
    }
    if (status === "custom" && statusColor !== defaultColor) {
      setStatusColor(customColor);
    }
  }, []);

  const calculateNum = (num: number | string) => {
    if (typeof num === "string") {
      return stat;
    }
    if (!forceDecimal) {
      return millify(num, {
        precision: decimal,
        decimalSeparator: ".",
      });
    }
    const word = millify(num, {
      precision: decimal,
      decimalSeparator: ".",
    });
    const splited = word.split(".");
    if (splited.length === 1) {
      const num = word.match(/\d+/g);
      const text = word.match(/[a-zA-Z]+/g) ?? " ";
      return `${num![0]}.00${text![0]}`;
    } else {
      const firstNum = splited[0];
      const secondNum = splited[1].match(/\d+/g);
      const text = splited[1].match(/[a-zA-Z]+/g) ?? " ";
      return `${firstNum}.${secondNum![0].padEnd(2, "0")}${text[0]}`;
    }
  };

  const tooltip = props.comment && (
    <Tooltip
      rounded={"lg"}
      px="2"
      pt={"2"}
      bg="#100e"
      boxShadow={"xl"}
      color={"white"}
      aria-label="a tooltip that add extra information like attribution for api"
      hasArrow
      label={
        <ReactMarkdown components={Renderer()}>{props.comment}</ReactMarkdown>
      }
    >
      <IconButton
        size={"xs"}
        variant="link"
        _focus={{ outline: "none" }}
        pt={"-1"}
        px={"3"}
        icon={<AiOutlineInfoCircle />}
        aria-label={""}
      />
    </Tooltip>
  );
  let splitedChange = null;
  if (typeof change === "number") {
    splitedChange = millify(change, {
      precision: decimal,
      decimalSeparator: ".",
    }).split(".");
  }

  return (
    <Stat
      px={{ base: 2, md: 4 }}
      zIndex={0}
      pt="3"
      pb={"2"}
      shadow="base"
      overflow={"hidden"}
      transition={"box-shadow 0.4s"}
      _hover={{ boxShadow: "var(--chakra-shadows-xl)" }}
      bg={bgCard}
      border="1px solid"
      borderColor={statusColor}
      rounded="lg"
    >
      {props.link === undefined ? (
        <StatLabel fontWeight="medium" noOfLines={1} display={"inline-flex"}>
          {title} {tooltip}
        </StatLabel>
      ) : (
        <Flex>
          {/* <Link
            href={
              isExternalLink
                ? props.link
                : `https://app.flipsidecrypto.com/velocity/queries/${props.link}`
            }
            isExternal
          > */}
          <StatLabel fontWeight="medium" noOfLines={1} display={"flex"}>
            {title}{" "}
            {/* <Box px={"1"}>
              <FiExternalLink />
            </Box> */}
          </StatLabel>
          {/* </Link> */}
          {tooltip}
        </Flex>
      )}

      <StatNumber
        pt={"1"}
        color={statusColor}
        fontSize="2xl"
        fontWeight="extrabold"
      >
        <Box display={"inline-flex"}>
          {calculateNum(stat)}
          <Box fontSize={"xs"} alignSelf="center" ps={2} fontWeight={"normal"}>
            {" "}
            {props.unit ?? ""}
          </Box>
        </Box>
      </StatNumber>

      <Box
        width={"35%"}
        h="full"
        opacity={0.2}
        bg={statusColor}
        inset="0"
        clipPath={"polygon(20% 0%, 100% 0, 100% 100%, 0% 100%);"}
        left={"65%"}
        pos="absolute"
      ></Box>
      {change != null && (
        <Box
          width={"30%"}
          h="full"
          inset="0"
          left={"70%"}
          top={change! > 0 ? "25%" : "-25%"}
          transform="auto"
          rotate={change! > 0 ? "0" : "180deg"}
          pos="absolute"
          zIndex={1}
          display="flex"
          justifyContent={"center"}
          alignItems="center"
          color={"blackAlpha.800"}
          scale="1.75"
        >
          {hasArrowIcon && (
            <HiArrowSmUp
              opacity={colorMode === "dark" ? 0.2 : 0.1}
              fontSize={"11rem"}
            />
          )}
        </Box>
      )}
      {splitedChange != null && (
        <Box
          width={"30%"}
          h="full"
          inset="0"
          left={"70%"}
          top={"0"}
          pos="absolute"
          zIndex={1}
          display="flex"
          justifyContent={"center"}
          alignItems="center"
          color={statusColor}
        >
          <Box display="flex" flexDir={"row"} alignItems={"baseline"}>
            <Box fontSize={"2xl"} me="1px" fontWeight="bold">
              {splitedChange[0] as string}
            </Box>
            <Box verticalAlign={"baseline"} fontSize={"sm"} fontWeight="bold">
              {splitedChange.length === 2
                ? `.${splitedChange[1]}${changeUnit}`
                : ""}
            </Box>
          </Box>
        </Box>
      )}
    </Stat>
  );
};
