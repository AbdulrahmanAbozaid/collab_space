import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Link,
  Text,
} from "@chakra-ui/react";
import { Link as ReactLink } from "react-router-dom";
import React, { useState } from "react";
export interface LoginFormInputs {
  email: string;
  password: string;
}
import { SubmitHandler, useForm } from "react-hook-form";
import { FaEnvelope, FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import SocialAuth from "../../components/SocialAuth";
const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { handleSubmit, register } = useForm<LoginFormInputs>();
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };
  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    console.log(data);
  };
  return (
    <Box
      width="full"
      maxWidth="600px"
      bg="brand.white"
      p={6}
      my={2}
      borderWidth={1}
      borderRadius={8}
      boxShadow="lg"
    >
      <Box textAlign="left">
        <Heading fontSize={"3xl"}>Login To CollabSpace</Heading>
        <Text mt={2} color="gray.600">
          Welcome back, please login
        </Text>
      </Box>
      <Box mt={5} textAlign="left">
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl mb={4}>
            <FormLabel>Email</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FaEnvelope />
              </InputLeftElement>

              <Input
                rounded={"lg"}
                type="email"
                variant="main"
                placeholder="Enter your email"
                {...register("email", { required: true })}
              />
            </InputGroup>
          </FormControl>
          <FormControl mb={4} borderRadius={"lg"}>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FaLock />
              </InputLeftElement>
              <Input
                rounded={"lg"}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                variant="main"
                {...register("password", { required: true })}
              />
              <InputRightElement>
                <IconButton
                  onClick={togglePassword}
                  bg={"transparent"}
                  aria-label="toggle password"
                  fill={"gray.200"}
                  _hover={{ bg: "transparent" }}
                  icon={
                    showPassword ? (
                      <FaEye fill={"#000"} size={16} />
                    ) : (
                      <FaEyeSlash fill={"#000"} size={16} />
                    )
                  }
                />
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <Box textAlign="left" mt={4}>
            <Link as={ReactLink} to={"/forgot-password"} color="#4F46E5">
              Forgot your password?
            </Link>
          </Box>
          <Button
            width="full"
            mt={4}
            type="submit"
            bg="#4F46E5"
            variant={"submit"}
            color="white"
          >
            Sign In
          </Button>
        </form>
      </Box>
      <SocialAuth />
      <Box textAlign="left" mt={4}>
        <Text>
          Don't have an account?{" "}
          <Link as={ReactLink} to={"/register"} color="#4F46E5">
            Signup here
          </Link>
        </Text>
      </Box>
    </Box>
  );
};

export default Login;
