import {
  useColorModeValue,
  Button,
  Flex,
  IconButton,
  FlexProps,
  Box,
  Text,
} from "@chakra-ui/react";
import names from "lib/utility/names";
import Image from "next/image";

import sideMenuItems from "lib/utility/sideMenuItems";
import { useRouter } from "next/router";
import { FiInfo } from "react-icons/fi";
import CurrentStatusPage from "./CurrentStatusPage";
import ThemeToggle from "./ThemeToggle";
import Link from "next/link";
interface DesktopProps extends FlexProps {
  onOpen: () => void;
}

export const DesktopNav = ({ onOpen, ...rest }: DesktopProps) => {
  return (
    <Box
      display={{ base: "none", md: "block" }}
      px={"8"}
      pb={"4"}
      position="sticky"
      top={"4"}
      zIndex="dropdown"
    >
      <DesktopTopNav />

      <DesktopLinkNav />
    </Box>
  );
};
const DesktopLinkNav = () => {
  const router = useRouter();
  const path = router.asPath;

  const bgColor = useColorModeValue(
    names.BLOCKCHAIN_HEADER_GRADIENT_OVERLAY_LIGHT,
    names.BLOCKCHAIN_HEADER_GRADIENT_OVERLAY_DARK
  );
  return (
    <Box
      position={"relative"}
      borderBottomRadius={"xl"}
      pb="2px"
      px={"3px"}
      bg={names.BLOCKCHAIN_HEADER_GRADIENT}
      overflow="hidden"
    >
      <Box
        position={"absolute"}
        inset="0"
        zIndex={"0"}
        filter=""
        bg={bgColor}
      />
      <Box
        zIndex={"banner"}
        position="relative"
        width={"100%"}
        borderRadius={"2xl"}
        py={2}
        px={3}
        bg={useColorModeValue("#a9a9a938", "#1919197b")}
        backdropBlur="2xl"
        justifyContent={"space-between"}
        experimental_spaceX="2"
        flexWrap="nowrap"
        display={"flex"}
        flex="row"
      >
        <Box experimental_spaceX={"1"}>
          {sideMenuItems.map((link, index) => (
            <Button
              size={"sm"}
              _hover={{
                bg: useColorModeValue("#2224", "#a9a9a92b"),
              }}
              borderWidth="1px"
              borderColor={useColorModeValue("#1114", "#a9a9a91b")}
              bg={
                path === link.path.toLocaleLowerCase() ? "#0003" : "transparent"
              }
              textColor={"white"}
              onClick={() => {
                router.push(link.path);
              }}
              key={link.name}
              leftIcon={link.icon({})}
            >
              {link.name}
            </Button>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

const DesktopTopNav = () => {
  const router = useRouter();
  const bgColor = useColorModeValue(
    names.BLOCKCHAIN_HEADER_GRADIENT_OVERLAY_LIGHT,
    names.BLOCKCHAIN_HEADER_GRADIENT_OVERLAY_DARK
  );
  const NearGradient = names.BLOCKCHAIN_HEADER_GRADIENT;
  return (
    <Flex
      p={1}
      bg={NearGradient}
      width={"full"}
      justifyContent={"space-between"}
      alignItems="center"
      position={"relative"}
      borderTopRadius={"xl"}
      overflow="hidden"
      zIndex="1"
    >
      <Box mx={"2"} display={"flex"} alignItems="center">
        <Image
          alt={`logo of ${names.BLOCKCHAIN}`}
          style={{
            transform: "scale(1)",
            filter: "grayscale(0.2)",
            zIndex: "1",
          }}
          width={132}
          height={32}
          src={names.BLOCKCHAIN_HEADER_IMAGE_URL}
        />
        <Text
          mx={"2"}
          fontFamily="'Carter One', cursive"
          fontSize="2xl"
          letterSpacing={"wide"}
          textColor={"white"}
          fontWeight={"extrabold"}
          zIndex="1"
        >
          {names.APP_NAME}
        </Text>
      </Box>
      <Box
        position={"absolute"}
        inset="0"
        zIndex={"0"}
        filter=""
        bg={bgColor}
      />

      <Box experimental_spaceX={"2"} mr={"4"} textAlign="end">
        {router.pathname !== "/about" && <CurrentStatusPage />}
        <Button
          zIndex={1}
          size={"sm"}
          onClick={() => router.push("/about")}
          aria-label="About"
          rightIcon={<FiInfo />}
        >
          About
        </Button>

        <ThemeToggle />
      </Box>
    </Flex>
  );
};
