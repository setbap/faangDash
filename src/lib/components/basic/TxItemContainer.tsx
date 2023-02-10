import { Stack } from "@chakra-ui/react";
import { ReactNode } from "react";

export const TxItemContainer = ({ children }: { children: ReactNode }) => (
  <Stack
    spacing={["4", "6"]}
    direction={"column"}
    p={["5", "8"]}
    borderWidth="2px"
    borderColor="green.200"
    rounded={"md"}
    bg="#232323"
    boxShadow={"base"}
    alignItems="center"
  >
    {children}
  </Stack>
);
