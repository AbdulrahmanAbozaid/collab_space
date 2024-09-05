import { Flex, InputGroup, Input, InputRightElement, Avatar, Box } from '@chakra-ui/react';
import { FiSearch } from 'react-icons/fi';

const TopBar = () => {
  return (
    <Flex justify="space-between" align="center" p="4" bg="white" boxShadow="sm">
      <InputGroup w="300px">
        <Input placeholder="Search documents..." />
        <InputRightElement children={<FiSearch />} />
      </InputGroup>
      <Box>
        <Avatar name="Amanda" src="https://bit.ly/broken-link" />
      </Box>
    </Flex>
  );
};

export default TopBar;
