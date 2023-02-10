import { BoxProps, Box } from "@chakra-ui/react";
import sideMenuItems from "lib/utility/sideMenuItems";
import { useRouter } from "next/router";
import { FiInfo } from "react-icons/fi";
import { NavItem } from "./NavItem";

interface DrawerContent extends BoxProps {
  onClose: () => void;
}

export const MobileNavDrawerContent = ({ onClose, ...rest }: DrawerContent) => {
  const router = useRouter();
  return (
    <Box
      overflowX={"hidden"}
      experimental_spaceY="2"
      transition="0.7s ease"
      w="full"
      {...rest}
    >
      {sideMenuItems.map((link) => (
        <NavItem
          isActive={router.pathname === link.path}
          path={link.path}
          key={link.name}
          icon={link.icon}
        >
          {link.name}
        </NavItem>
      ))}
      <NavItem
        isActive={router.pathname === "/about"}
        path={"about"}
        icon={FiInfo}
      >
        About
      </NavItem>
    </Box>
  );
};
