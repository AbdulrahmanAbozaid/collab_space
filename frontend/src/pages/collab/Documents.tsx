import { useEffect } from "react";
import {
  Box,
  Grid,
  Text,
  Button,
  VStack,
  Icon,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";
import DocumentCard from "../../components/DocumentCard";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchDocumentsThunk } from "../../redux/documents/recentDocs";
import {
  createDocumentThunk,
  fetchDocumentThunk,
} from "../../redux/documents/doc";

const Documents = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const toast = useToast();

  const { documents, isLoading, error } = useAppSelector(
    (state) => state.documents,
  );

  useEffect(() => {
    dispatch(fetchDocumentsThunk());
  }, [dispatch]);

  const handleCreateDocument = async () => {
    try {
      const resultAction = await dispatch(
        createDocumentThunk("New Document"),
      ).unwrap();
      console.log("🚀 ~ handleCreateDocument ~ resultAction:", resultAction);
      if (resultAction?.data?.document) {
        const documentId = resultAction.data.document._id;
        toast({
          title: "Document created!",
          description: `Document ${documentId} created successfully.`,
          status: "success",
          position: "bottom",
          duration: 3000,
          isClosable: true,
        });
        navigate(`/doc/${documentId}`);
      }
    } catch (err: any) {
      toast({
        title: "Failed to create document",
        description: err || "Something went wrong",
        status: "error",
        position: "bottom",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleOpenDocument = async (id: string) => {
    try {
      await dispatch(fetchDocumentThunk(id)).unwrap();
      navigate(`/doc/${id}`);
    } catch (err: any) {
      toast({
        title: "Failed to open document",
        description: err || "Could not fetch the document",
        status: "error",
        position: "bottom",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={4}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Start New Document
      </Text>
      <Grid
        templateColumns="repeat(auto-fit, minmax(150px, 1fr))"
        gap={6}
        mb={8}
      >
        <VStack>
          <Button
            colorScheme="purple"
            size="lg"
            rounded="full"
            w={16}
            h={16}
            iconSpacing={0}
            aria-label="Create New Document"
            onClick={handleCreateDocument}
            isLoading={isLoading}
          >
            <Icon as={FaPlus} w={6} h={6} />
          </Button>
          <Text fontSize="sm" fontWeight="semibold">
            Blank Document
          </Text>
        </VStack>
      </Grid>

      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Recent Documents
      </Text>
      {isLoading ? (
        <Spinner />
      ) : error ? (
        <Text color="red.500">{error}</Text>
      ) : documents.length === 0 ? (
        <Text>No documents available</Text>
      ) : (
        <Grid templateColumns="repeat(auto-fit, minmax(150px, 1fr))" gap={6}>
          {documents.map((doc) => (
            <Box
              key={doc._id}
              cursor="pointer"
              onClick={() => handleOpenDocument(doc._id)}
            >
              <DocumentCard
                title={doc.title}
                lastUpdated={new Date(doc.updated_at).toLocaleString()}
                contentPreview={doc.content}
              />
            </Box>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Documents;
