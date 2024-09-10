import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Text,
  useToast,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useDisclosure,
} from "@chakra-ui/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { updateUserProfile, deleteUserAccount } from "../../redux/auth/Thunks/EditThunk";
import { User } from "../../redux/auth/authTypes"; // Assuming you have the User interface

interface ProfileFormInputs {
  username: string;
  email: string;
}

const Profile: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user) as User; // Assuming user info is in the auth state
  const [isEditing, setIsEditing] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure(); // For delete confirmation
  const cancelRef = React.useRef(null);
  const toast = useToast();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileFormInputs>();

  // Populate form with user data when the component is loaded
  useEffect(() => {
    if (user) {
      reset({
        username: user.username,
        email: user.email,
      });
    }
  }, [user, reset]);

  // Form submit handler
  const onSubmit: SubmitHandler<ProfileFormInputs> = async (data) => {
    try {
      await dispatch(updateUserProfile(data)).unwrap(); // Assuming you have an update action
      toast({
        title: "Profile updated successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setIsEditing(false);
    } catch (error: any) {
      toast({
        title: "Failed to update profile",
        description: error.message || "Something went wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Delete user account handler
  const handleDeleteAccount = async () => {
    try {
      await dispatch(deleteUserAccount()).unwrap(); // Assuming you have a delete action
      toast({
        title: "Account deleted successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      // Redirect to a login or home page after deletion, as user is logged out
    } catch (error: any) {
      toast({
        title: "Failed to delete account",
        description: error.message || "Something went wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    onClose(); // Close the confirmation dialog
  };

  return (
    <Box maxW="600px" mx="auto" p={6} bg="white" borderRadius="md" boxShadow="lg">
      <Heading mb={4} textAlign="center">Profile</Heading>

      {!isEditing ? (
        <Box textAlign="left">
          <Text mb={4}>
            <strong>Username:</strong> {user?.username}
          </Text>
          <Text mb={4}>
            <strong>Email:</strong> {user?.email}
          </Text>
          <Button colorScheme="blue" onClick={() => setIsEditing(true)}>
            Edit Profile
          </Button>
          <Button colorScheme="red" variant="outline" ml={4} onClick={onOpen}>
            Delete Account
          </Button>
        </Box>
      ) : (
        <Box as="form" onSubmit={handleSubmit(onSubmit)}>
          {/* Username Field */}
          <FormControl mb={4} isInvalid={!!errors.username}>
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              placeholder="Enter your username"
              {...register("username", { required: "Username is required" })}
            />
            {errors.username && (
              <Text color="red.500">{errors.username.message}</Text>
            )}
          </FormControl>

          {/* Email Field */}
          <FormControl mb={4} isInvalid={!!errors.email}>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              placeholder="Enter your email"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <Text color="red.500">{errors.email.message}</Text>
            )}
          </FormControl>

          {/* Submit Button */}
          <Button colorScheme="blue" type="submit" mr={4}>
            Save Changes
          </Button>
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
        </Box>
      )}

      {/* Delete Account Confirmation Dialog */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Account
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDeleteAccount} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default Profile;
