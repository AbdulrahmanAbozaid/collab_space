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
import { SubmitHandler, useForm } from "react-hook-form";
import { FaEnvelope, FaEye, FaEyeSlash, FaLock, FaUser } from "react-icons/fa";
import SocialAuth from "../../components/SocialAuth";
import { registerUser } from "../../redux/auth/authSlice";
import { useAppDispatch } from "../../redux/hooks";

export interface RegisterFormInputs {
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const dispatch = useAppDispatch();
  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm<RegisterFormInputs>();

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    console.log(data);
    await dispatch(registerUser(data))
      .unwrap()
      .then((res) => {
        console.log(res);
      });
  };

  const password = watch("password");

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
        <Heading fontSize={"3xl"}>Create an Account</Heading>
        <Text mt={2} color="gray.600">
          Join CollabSpace today!
        </Text>
      </Box>
      <Box mt={5} textAlign="left">
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl mb={4} isInvalid={!!errors.username}>
            <FormLabel>Username</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FaUser />
              </InputLeftElement>
              <Input
                rounded={"lg"}
                type="text"
                variant="main"
                placeholder="Enter your username"
                {...register("username", { required: "Username is required" })}
              />
            </InputGroup>
            {errors.username && (
              <Text color="red.500">{errors.username.message}</Text>
            )}
          </FormControl>

          <FormControl mb={4} isInvalid={!!errors.email}>
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
                {...register("email", { required: "Email is required" })}
              />
            </InputGroup>
            {errors.email && (
              <Text color="red.500">{errors.email.message}</Text>
            )}
          </FormControl>

          <FormControl mb={4} borderRadius={"lg"} isInvalid={!!errors.password}>
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
                {...register("password", { required: "Password is required" })}
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
            {errors.password && (
              <Text color="red.500">{errors.password.message}</Text>
            )}
          </FormControl>

          <FormControl
            mb={4}
            borderRadius={"lg"}
            isInvalid={!!errors.confirmPassword}
          >
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FaLock />
              </InputLeftElement>
              <Input
                rounded={"lg"}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                variant="main"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
              />
              <InputRightElement>
                <IconButton
                  onClick={toggleConfirmPassword}
                  bg={"transparent"}
                  aria-label="toggle confirm password"
                  fill={"gray.200"}
                  _hover={{ bg: "transparent" }}
                  icon={
                    showConfirmPassword ? (
                      <FaEye fill={"#000"} size={16} />
                    ) : (
                      <FaEyeSlash fill={"#000"} size={16} />
                    )
                  }
                />
              </InputRightElement>
            </InputGroup>
            {errors.confirmPassword && (
              <Text color="red.500">{errors.confirmPassword.message}</Text>
            )}
          </FormControl>

          <Button
            width="full"
            mt={4}
            type="submit"
            bg="#4F46E5"
            variant={"submit"}
            color="white"
          >
            Sign Up
          </Button>
        </form>
      </Box>
      <SocialAuth />
      <Box textAlign="left" mt={3}>
        <Text>
          Already have an account?{" "}
          <Link as={ReactLink} to={"/login"} color="#4F46E5">
            Login here
          </Link>
        </Text>
      </Box>
    </Box>
  );
};

export default Register;
