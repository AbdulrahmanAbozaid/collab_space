import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Link,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FaEnvelope } from "react-icons/fa";
import { Link as ReactLink } from "react-router-dom";

export interface ForgotPasswordFormInputs {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<ForgotPasswordFormInputs>();

  const onSubmit: SubmitHandler<ForgotPasswordFormInputs> = async (data) => {
    console.log(data);
  };

  return (
    <Box
      width="full"
      maxWidth="450px"
      bg="brand.white"
      p={8}
      borderWidth={1}
      borderRadius={8}
      boxShadow="lg"
      textAlign="center"
    >
      <Heading fontSize={"3xl"}>Forgot your password?</Heading>
      <Text mt={4} color="gray.600">
        You&apos;ll get an email with a reset link.
      </Text>

      <Box mt={8} textAlign="left">
        <form onSubmit={handleSubmit(onSubmit)}>
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
                {...register("email", {
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "Invalid email address",
                  },
                })}
              />
            </InputGroup>
            {errors.email && (
              <Text color="red.500">{errors.email.message}</Text>
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
            Send Reset Link
          </Button>
        </form>
      </Box>
      <Box textAlign="left" mt={3}>
        <Text>
          <Link as={ReactLink} to={"/verify-email"} color="#4F46E5">
            Already Have code ?
          </Link>
        </Text>
      </Box>
    </Box>
  );
};

export default ForgotPassword;
