import { Box, Text, VStack, Switch, FormControl, FormLabel } from "@chakra-ui/react";

const Settings = () => {
  return (
    <Box p={4}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Settings
      </Text>
      <VStack spacing={4} align="stretch">
        <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor="email-alerts" mb="0">
            Enable Email Alerts
          </FormLabel>
          <Switch id="email-alerts" />
        </FormControl>

        <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor="dark-mode" mb="0">
            Dark Mode
          </FormLabel>
          <Switch id="dark-mode" />
        </FormControl>

        {/* Add more settings options as needed */}
      </VStack>
    </Box>
  );
};

export default Settings;
