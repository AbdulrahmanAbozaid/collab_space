import {
  AbsoluteCenter,
  Box,
  Button,
  Divider,
  Flex,
  Text,
} from "@chakra-ui/react";
import { FaFacebook, FaGithub, FaGoogle } from "react-icons/fa";

export default function SocialAuth() {
  return (
    <Box textAlign="center" mt={4}>
      <Box position="relative" py={4} px={0}>
        <Divider borderColor={"gray.300"} />
        <AbsoluteCenter bg="white" px="4">
          <Text fontSize="lg" fontWeight="medium">
            or
          </Text>
        </AbsoluteCenter>
      </Box>
      <Flex
        mt={3}
        align="center"
        justify="space-between"
        gap={2}
        wrap={{ base: "wrap", md: "nowrap" }}
      >
        <Button leftIcon={<FaGoogle size={20} />} width="full" variant="google">
          Google
        </Button>
        <Button leftIcon={<FaGithub size={20} />} width="full" variant="github">
          GitHub
        </Button>
        <Button
          leftIcon={<FaFacebook size={20} />}
          width="full"
          variant="facebook"
        >
          Facebook
        </Button>
      </Flex>
    </Box>
  );
}
