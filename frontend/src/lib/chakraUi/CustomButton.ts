// src/theme/components/button.ts

import { defineStyleConfig } from "@chakra-ui/react";

const Button = defineStyleConfig({
  baseStyle: {
    fontSize: "md",
    fontWeight: "500",
    borderRadius: "lg",
  },
  sizes: {
    wide: {
      py: 2.5,
      px: 16,
    },
    lg: {
      py: 3,
      px: 4,
    },
    xl: {
      h: "56px",
      fontSize: "lg",
      px: "32px",
    },
  },
  variants: {
    submit: {
      fontWeight: "500",
      py: 3,
      px: 2,
      bg: "brand.main",
      color: "brand.white",
      _hover: {
        opacity: 0.8,
      },
      _active: {
        transform: "scale(.98)",
      },
    },
    primary: {
      bg: "brand.main",
      color: "brand.white",
      _hover: {
        bg: "brand.black",
      },
    },
    secondary: {
      bg: "brand.white",
      color: "brand.main",
      border: "2px solid",
      borderColor: "brand.main",
      _hover: {
        bg: "brand.bg",
      },
    },
    google: {
      px: 4,
      py: 2.5,
      border: "2px",
      borderColor: "black",
      bg: "transparent",
      color: "black",
      borderRadius: "lg",
      fontWeight: "500",
      fontSize: "lg",
      transition: "all 0.3s ease",
      _hover: {
        bg: "#f1f3f4",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        textDecoration: "none",
      },
      _active: {
        transform: "scale(0.97)",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
      },
    },
    github: {
      px: 4,
      py: 2.5,
      border: "2px",
      borderColor: "gray.800",
      bg: "transparent",
      //   borderColor: "black",
      //   bg: "transparent",
      color: "black",
      //   color: "gray.800",
      borderRadius: "lg",
      fontWeight: "500",
      fontSize: "lg",
      transition: "all 0.3s ease",
      _hover: {
        bg: "gray.100",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        textDecoration: "none",
      },
      _active: {
        transform: "scale(0.97)",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
      },
    },
    facebook: {
      px: 4,
      py: 2.5,
      border: "2px",
      borderColor: "black",
      bg: "transparent",
      color: "black",
      borderRadius: "lg",
      fontWeight: "500",
      fontSize: "lg",
      transition: "all 0.3s ease",
      _hover: {
        bg: "#e7f0ff",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        textDecoration: "none",
      },
      _active: {
        transform: "scale(0.97)",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
      },
    },
  },
  defaultProps: {
    size: "lg",
    variant: "primary",
  },
});

export default Button;
