// components/AddCollaborator.tsx

import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addCollaboratorThunk } from '../../redux/documents/doc';
import { useAppDispatch } from '../../redux/hooks';
import { useToast } from '@chakra-ui/react';

const AddCollaboratorPage: React.FC = () => {
  const { id: documentId } = useParams(); // Get document ID from route params
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    handleOpenDocument(documentId as string);
  }, [dispatch, documentId, navigate]);

  const handleOpenDocument = async (id: string) => {
    try {
      const data = await dispatch(addCollaboratorThunk(id)).unwrap();
      console.log("🚀 ~ handleOpenDocument ~ data:", data)
      navigate(`/doc/${id}`);
      toast({
        title: "Joined Successfully",
        description: "Started Collaborating in the Document",
        status: "success",
        position: "bottom",
        duration: 3000,
        isClosable: true,
      })
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

  return <div>Loading...</div>; // Display loading while the collaborator is being added
};

export default AddCollaboratorPage;
