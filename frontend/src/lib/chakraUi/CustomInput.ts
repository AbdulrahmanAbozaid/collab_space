import { defineStyleConfig } from "@chakra-ui/react";

const Input = defineStyleConfig({
  sizes: {
    lg: {
      field: {
        borderRadius: "lg",
        fontSize: "xl",
        px: 2,
        py: 2,
      },
    },
  },
  variants: {
    main: {
      field: {
        bg: "gray.200",
        border: "2px",
        borderColor: "transparent",
        outline: "none",
        _placeholder: {
          color: "gray.300",
        },
        _hover: {
          borderColor: "brand.main",
        },
        _active: {
          borderColor: "brand.main",
        },
        _focus: {
          borderColor: "brand.main",
        },
      },
    },
  },
  defaultProps: {
    size: "lg",
    variant: "main",
  },
});
export default Input;
