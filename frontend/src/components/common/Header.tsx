import { Box, Button, Container, Flex, Heading } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isAuthenticated = false;

  const buttonText = pathname === "/login" ? "Sign Up" : "Sign In";
  const buttonPath = pathname === "/login" ? "/register" : "/login";

  const handleButtonClick = () => {
    navigate(buttonPath);
  };

  return (
    <Box
      as="header"
      borderBottom={"2px"}
      borderBottomColor={"gray.200"}
      py=".8rem"
      bg="brand.white"
      width={"full"}
      color="white"
      position={"fixed"}
      top={0}
      left={0}
      zIndex={"99"}
    >
      <Container maxW={"container.xl"}>
        <Flex align="center" justify="space-between" wrap="nowrap">
          <Flex w={"full"} align="center" mr={5}>
            <Heading
              color="brand.black"
              as="h1"
              size="lg"
              letterSpacing={"tighter"}
            >
              CollabSpace
            </Heading>
          </Flex>
          {!isAuthenticated && (
            <Button
              size={"wide"}
              bg={"brand.main"}
              color={"brand.white"}
              variant="outline"
              _hover={{ opacity: 0.9 }}
              _active={{ opacity: 0.9 }}
              onClick={handleButtonClick}
            >
              {buttonText}
            </Button>
          )}
        </Flex>
      </Container>
    </Box>
  );
}
