import type { DeepPartial, Theme } from "@chakra-ui/react";

/** extend additional color here */

/** override chakra colors here */
const overridenChakraColors: DeepPartial<Theme["colors"]> = {};

const colors = {
  ...overridenChakraColors,
};

export default colors;
