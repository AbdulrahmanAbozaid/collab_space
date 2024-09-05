import { Box, Image, Text, VStack } from '@chakra-ui/react';

interface DocumentCardProps {
  title: string;
  lastUpdated: string;
  imageUrl: string;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ title, lastUpdated, imageUrl }) => {
  return (
    <Box bg="white" p="4" borderRadius="md" boxShadow="sm">
      <Image src={imageUrl} alt={title} borderRadius="md" mb="4" />
      <VStack align="start" spacing="1">
        <Text fontWeight="bold">{title}</Text>
        <Text fontSize="sm" color="gray.500">Updated {lastUpdated}</Text>
      </VStack>
    </Box>
  );
};

export default DocumentCard;
