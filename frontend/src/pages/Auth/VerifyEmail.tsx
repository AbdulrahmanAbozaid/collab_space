import {
  Box,
  Button,
  FormControl,
  Heading,
  PinInput,
  PinInputField,
  HStack,
  Text,
  Center,
} from "@chakra-ui/react";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

export interface VerifyEmailFormInputs {
  code: string;
}

const VerifyEmail: React.FC = () => {
  const email = "test@gmail.com";
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyEmailFormInputs>();

  const onSubmit: SubmitHandler<VerifyEmailFormInputs> = async (data) => {
    console.log(data);
  };

  return (
    <Box
      width="full"
      maxWidth="450px"
      bg="white"
      p={8}
      borderWidth={1}
      borderRadius={8}
      boxShadow="lg"
      textAlign="center"
    >
      <Heading fontSize={"3xl"}>Verify your Email</Heading>
      <Text mt={4} color="gray.600">
        We have sent a code to your email
      </Text>
      <Center fontSize={{ base: "sm", sm: "md" }} fontWeight="bold">
        {email}
      </Center>

      <Box mt={8} textAlign="left">
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl isInvalid={!!errors.code} mb={4}>
            <HStack justify="center">
              <Controller
                name="code"
                control={control}
                // rules={{
                //   required: "PIN is required",
                //   pattern: {
                //     value: /^[0-9]{4}$/,
                //     message: "PIN must be exactly 4 digits",
                //   },
                // }}
                render={({ field: { onChange, value } }) => (
                  <PinInput otp value={value} size={"lg"} onChange={onChange}>
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                  </PinInput>
                )}
              />
            </HStack>
            {/* {errors.code && (
              <Text color="red.500" mt={2}>
                {errors.code.message}
              </Text> 
            )}*/}
          </FormControl>
          <Button
            width="full"
            mt={4}
            type="submit"
            bg="#4F46E5"
            variant={"submit"}
            color="white"
          >
            Verify Email
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default VerifyEmail;
