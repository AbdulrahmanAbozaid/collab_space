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
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Spinner,
} from "@chakra-ui/react";
import { Link as ReactLink, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FaEnvelope, FaEye, FaEyeSlash, FaLock, FaUser } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { signupUser, verifyEmail } from "../../redux/auth/Thunks";
import SocialAuth from "../../components/SocialAuth";
import { RegisterResponse } from "../../redux/auth/authTypes";
import { RootState } from "../../redux/store";

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
  const [isOtpModalOpen, setIsOtpModalOpen] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>();
  const [userEmail, setUserEmail] = useState<string>("");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const { isLoading } = useAppSelector((state: RootState) => state.auth);

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

  // Handle form submission for registration
  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    try {
      const signupData = {
        username: data.username,
        email: data.email,
        password: data.password,
      };

      await dispatch(signupUser(signupData))
        .unwrap()
        .then((result: any | RegisterResponse) => {
          console.log(result);
          if (result.success) {
            setUserEmail(data.email);
            toast({
              title: "Registration successful.",
              description: result.message,
              status: "success",
              duration: 5000,
              isClosable: true,
            });
            // Show OTP modal to verify email
            setIsOtpModalOpen(true);
          }
        });
    } catch (error: any) {
      toast({
        title: "Registration failed.",
        description: error.message || "Something went wrong.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Handle OTP verification
  const verifyOtp = async () => {
    try {
      dispatch(
        verifyEmail({
          otp: otp as string,
          email: userEmail,
        })
      )
        .unwrap()
        .then((response) => {
          if ((response as any).success) {
            toast({
              title: "Email Verified.",
              description: (response as any).message,
              status: "success",
              duration: 5000,
              isClosable: true,
            });
            setIsOtpModalOpen(false);
            navigate("/login"); // Redirect to login page
          }
        });
    } catch (error: any) {
      console.log(error);

      toast({
        title: "OTP Verification failed.",
        description: error.response?.data?.message || "Invalid OTP code.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
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
          {/* Username Field */}
          <FormControl mb={4} isInvalid={!!errors.username}>
            <FormLabel>Username</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FaUser />
              </InputLeftElement>
              <Input
                rounded={"lg"}
                type="text"
                placeholder="Enter your username"
                {...register("username", { required: "Username is required" })}
              />
            </InputGroup>
            {errors.username && (
              <Text color="red.500">{errors.username.message}</Text>
            )}
          </FormControl>

          {/* Email Field */}
          <FormControl mb={4} isInvalid={!!errors.email}>
            <FormLabel>Email</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FaEnvelope />
              </InputLeftElement>
              <Input
                rounded={"lg"}
                type="email"
                placeholder="Enter your email"
                {...register("email", { required: "Email is required" })}
              />
            </InputGroup>
            {errors.email && (
              <Text color="red.500">{errors.email.message}</Text>
            )}
          </FormControl>

          {/* Password Field */}
          <FormControl mb={4} isInvalid={!!errors.password}>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FaLock />
              </InputLeftElement>
              <Input
                rounded={"lg"}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password", { required: "Password is required" })}
              />
              <InputRightElement>
                <IconButton
                  onClick={togglePassword}
                  bg={"transparent"}
                  aria-label="toggle password"
                  icon={showPassword ? <FaEye /> : <FaEyeSlash />}
                />
              </InputRightElement>
            </InputGroup>
            {errors.password && (
              <Text color="red.500">{errors.password.message}</Text>
            )}
          </FormControl>

          {/* Confirm Password Field */}
          <FormControl mb={4} isInvalid={!!errors.confirmPassword}>
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FaLock />
              </InputLeftElement>
              <Input
                rounded={"lg"}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
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
                  icon={showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                />
              </InputRightElement>
            </InputGroup>
            {errors.confirmPassword && (
              <Text color="red.500">{errors.confirmPassword.message}</Text>
            )}
          </FormControl>

          {/* Submit Button */}
          <Button
            isDisabled={isLoading}
            width="full"
            mt={4}
            type="submit"
            bg="#4F46E5"
            color="white"
          >
            {isLoading ? <Spinner size={"sm"} /> : "Sign Up"}
          </Button>
        </form>
      </Box>

      {/* Social Authentication */}
      <SocialAuth />

      <Box textAlign="left" mt={3}>
        <Text>
          Already have an account?{" "}
          <Link as={ReactLink} to="/login" color="#4F46E5">
            Login here
          </Link>
        </Text>
      </Box>

      {/* OTP Modal for Email Verification */}
      <Modal isOpen={isOtpModalOpen} onClose={() => setIsOtpModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Verify your Email</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Enter the OTP sent to your email</FormLabel>
              <Input
                value={otp}
                type="number"
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={verifyOtp}>
              Verify OTP
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Register;
