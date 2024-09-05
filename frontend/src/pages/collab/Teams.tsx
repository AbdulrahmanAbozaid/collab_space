import { Box, Text } from "@chakra-ui/react";
import TeamList from "../../components/TeamList";

const Teams = () => {
  return (
    <Box p={4}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Teams
      </Text>
      <TeamList />
    </Box>
  );
};

export default Teams;
