import { extendTheme, ThemeConfig } from "@chakra-ui/react";
import Button from "./CustomButton";
import Input from "./CustomInput";

const colors = {
  brand: {
    bg: "#F3F4F6",
    white: "#FFFFFF",
    main: "#4F46E5",
    black: "#000000",
  },
};

const styles = {
  global: {
    body: {
      bg: "brand.bg",
      color: "brand.black",
    },
    svg: {
      width:"20px",
      height:"20px",
      color: "gray.700",
    },
  },
};

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const components = {
  Button,
  Input,
};

const theme = extendTheme({ colors, styles, config, components });

export default theme;
