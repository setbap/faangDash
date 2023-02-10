import React, { ReactNode, useEffect } from "react";
import {
  Box,
  useColorModeValue,
  Drawer,
  DrawerContent,
  useDisclosure,
  useColorMode,
  DrawerBody,
  DrawerOverlay,
  DrawerHeader,
} from "@chakra-ui/react";
import MotionBox from "../motion/Box";
import { motion, useScroll } from "framer-motion";
import { DesktopNav } from "./DesktopNav";
import { MobileNav } from "./MobileNav";
import { MobileNavDrawerContent } from "./NavDrawerContent";

export default function SidebarWithHeader({
  children,
}: {
  children: ReactNode;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const variants = {
    hidden: { opacity: 0.01 },
    enter: { opacity: 1 },
    exit: { opacity: 0.01 },
  };
  const { scrollYProgress } = useScroll();

  return (
    <MotionBox
      variants={variants} // Pass the variant object into Framer Motion
      initial="hidden" // Set the initial state to variants.hidden
      animate="enter" // Animated state to variants.enter
      exit="exit" // Exit state (used later) to variants.exit
      transition={{ type: "linear" }} // Set the transition to linear
      minH="calc( 100vh - 2px )"
      bg={useColorModeValue(
        " linear-gradient(to top, #e2ebf0 0% , #cfd9df  100%)",
        "linear-gradient(to top, #090909,#000000)"
      )}
    >
      <motion.div
        className="progress-bar"
        style={{ scaleX: scrollYProgress }}
      />
      <Drawer
        autoFocus={true}
        isOpen={isOpen}
        placement="bottom"
        onClose={onClose}
        closeOnOverlayClick
        closeOnEsc
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="xl"
      >
        <DrawerOverlay />
        <DrawerContent bg={useColorModeValue("#fff", "#1c1c1c")}>
          <DrawerHeader borderBottomWidth="1px">Pages</DrawerHeader>
          <DrawerBody>
            <MobileNavDrawerContent onClose={onClose} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <DesktopNav onOpen={onOpen} />
      <MobileNav onOpen={onOpen} />

      <Box mx="auto">{children}</Box>
    </MotionBox>
  );
}
