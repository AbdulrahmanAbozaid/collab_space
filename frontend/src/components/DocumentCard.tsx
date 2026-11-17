import React from 'react';
import { Box, Text, Image } from "@chakra-ui/react";
import Quill from "quill";

interface DocumentCardProps {
  title: string;
  lastUpdated: string;
  contentPreview: any; // This will be the Quill Delta for the document
}

const DocumentCard: React.FC<DocumentCardProps> = ({ title, lastUpdated, contentPreview }) => {
  
  // Render Delta content as a minimized preview
  const renderPreview = () => {
    const quill = new Quill(document.createElement('div'));
    quill.setContents(contentPreview); // Set Quill Delta content

    // Render content as a small image preview (Google Docs-like)
    const deltaHtml = quill.root.innerHTML; // Get HTML of Delta content

    // Convert this HTML to an image or show it directly as text preview
    // Example: Show the first few lines or characters
    return (
      <Box dangerouslySetInnerHTML={{ __html: deltaHtml }} overflow="hidden" maxHeight="100px" />
    );
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={4}
      bg="white"
    >
      <Text fontWeight="bold">{title}</Text>
      <Text fontSize="sm" color="gray.500">
        Last updated: {lastUpdated}
      </Text>
      {contentPreview ? renderPreview() : <Text>No content</Text>}
    </Box>
  );
};

export default DocumentCard;
