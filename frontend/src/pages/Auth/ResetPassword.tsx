import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  IconButton,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

export interface ResetPasswordFormInputs {
  newPassword: string;
  confirmPassword: string;
}

const ResetPassword: React.FC = () => {
  const {
    handleSubmit,
    register,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<ResetPasswordFormInputs>();
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const toggleNewPasswordVisibility = () =>
    setShowNewPassword(!showNewPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const onSubmit: SubmitHandler<ResetPasswordFormInputs> = async (data) => {
    console.log(data);
  };
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const timer = setTimeout(() => {
        clearErrors();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [errors, clearErrors]);
  return (
    <Box
      width="full"
      maxWidth="500px"
      bg="brand.white"
      p={8}
      borderWidth={1}
      borderRadius={8}
      boxShadow="lg"
      textAlign="center"
    >
      <Heading fontSize={"3xl"}>Reset Your Password</Heading>
      <Text mt={4} color="gray.600">
        Enter your new password below.
      </Text>

      <Box mt={8} textAlign="left">
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl mb={4} isInvalid={!!errors.newPassword}>
            <FormLabel>New Password</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FaLock />
              </InputLeftElement>
              <Input
                rounded={"lg"}
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter your new password"
                variant="main"
                {...register("newPassword", {
                  required: "New password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters long",
                  },
                })}
              />
              <InputRightElement>
                <IconButton
                  onClick={toggleNewPasswordVisibility}
                  bg={"transparent"}
                  fill={"gray.200"}
                  _hover={{ bg: "transparent" }}
                  aria-label="toggle new password visibility"
                  icon={
                    showNewPassword ? (
                      <FaEye fill={"#000"} size={16} />
                    ) : (
                      <FaEyeSlash fill={"#000"} size={16} />
                    )
                  }
                />
              </InputRightElement>
            </InputGroup>
            {errors.newPassword && (
              <Text color="red.500">{errors.newPassword.message}</Text>
            )}
          </FormControl>

          <FormControl mb={4} isInvalid={!!errors.confirmPassword}>
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FaLock />
              </InputLeftElement>
              <Input
                rounded={"lg"}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your new password"
                variant="main"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === watch("newPassword") || "Passwords do not match",
                })}
              />
              <InputRightElement>
                <IconButton
                  onClick={toggleConfirmPasswordVisibility}
                  bg={"transparent"}
                  fill={"gray.200"}
                  _hover={{ bg: "transparent" }}
                  aria-label="toggle confirm password visibility"
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
            Reset Password
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default ResetPassword;
