import {
  FlexProps,
  Flex,
  Icon,
  Link,
  useColorModeValue,
} from "@chakra-ui/react";
import { ReactText } from "react";
import { IconType } from "react-icons";
import NextLink from "next/link";

interface NavItemProps extends FlexProps {
  icon: IconType;
  path: string;
  children: ReactText;
  isActive: boolean;
}
export const NavItem = ({
  icon,
  isActive,
  path,
  children,
  ...rest
}: NavItemProps) => {
  const activeBgColor = useColorModeValue("gray.200", "#232323");
  return (
    <NextLink href={path} passHref>
      <Link style={{ textDecoration: "none" }} href={""}>
        <Flex
          align="center"
          py={"4"}
          mb={"1"}
          transition="all 0.7s ease"
          borderRadius="lg"
          role="group"
          fontSize="md"
          fontWeight="medium"
          cursor="pointer"
          border={"1.5px solid transparent"}
          shadow={isActive ? "inner" : "none"}
          borderColor={
            isActive ? useColorModeValue("black", "white") : "transparent"
          }
          _hover={{
            borderColor: "gray.300",
          }}
          {...rest}
        >
          {icon && (
            <Icon
              mx="4"
              fontSize="1rem"
              fontWeight={"bold"}
              _groupHover={{
                color: "white",
              }}
              as={icon}
            />
          )}
          {children}
        </Flex>
      </Link>
    </NextLink>
  );
};
