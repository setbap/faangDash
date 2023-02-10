import { extendTheme, ThemeConfig } from "@chakra-ui/react";

import colors from "./colors";
import Button from "./components/button";
import fonts from "./fonts";

const config: ThemeConfig = {
  useSystemColorMode: false,
  initialColorMode: "light",
};

const customTheme = extendTheme({
  fonts,
  colors,
  config,
  components: {
    Button,
  },
});

export default customTheme;
