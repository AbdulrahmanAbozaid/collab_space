import React, { useRef, useState, useEffect } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import DocumentHeader from "../../components/documents/DocumentHeader";
import VoiceCallInterface from "../../components/documents/VoiceCall";
import { Box, Center, Button, IconButton } from "@chakra-ui/react";
import { MinusIcon } from "@chakra-ui/icons";
import { jsPDF } from "jspdf";  
const DocumentEditorPage: React.FC = () => {
  const [isCallActive, setIsCallActive] = useState(true);
  const [isCallVisible, setIsCallVisible] = useState(true);
  const [pageCount, setPageCount] = useState(1);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const quillInstances = useRef<Quill[]>([]);

  const mockCollaborators = [
    { name: "Alex", status: "editing" },
    { name: "Jamie", status: "viewing" },
  ];

  const mockParticipants = [
    { name: "John Doe", isMuted: false, avatarUrl: "/path/to/avatar1.png" },
    { name: "Jane Smith", isMuted: true, avatarUrl: "/path/to/avatar2.png" },
  ];

  const handleMute = (name: string) => {
    console.log(
      `${name} has been ${
        mockParticipants.find((p) => p.name === name)?.isMuted
          ? "unmuted"
          : "muted"
      }.`
    );
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    setIsCallVisible(false);
  };

  const handleToggleCall = () => {
    setIsCallVisible(!isCallVisible);
  };

  const handleRemovePage = (index: number) => {
    if (index > 0) {
      setPageCount((prevCount) => {
        pageRefs.current.splice(index, 1); // Remove the page ref
        quillInstances.current.splice(index, 1); // Remove the quill instance
        return prevCount - 1; // Decrease the page count
      });
    }
  };
  const handleFocusEditor = (index: number) => {
    // Ensure the quill instance is focused correctly
    if (quillInstances.current[index]) {
        quillInstances.current[index].focus(); // Delay to ensure proper focus
    }
  };

  useEffect(() => {
    pageRefs.current.forEach((pageRef, index) => {
      if (pageRef && !quillInstances.current[index]) {
        const quill = new Quill(pageRef, {
          theme: "snow",
          modules: {
            toolbar: [
              [{ header: [1, 2, 3, false] }],
              ["bold", "italic", "underline"],
              [{ list: "ordered" }, { list: "bullet" }],
              ["link", "image"],
            ],
          },
        });

        quillInstances.current[index] = quill;

        quill.keyboard.addBinding(
          {
            key: "Backspace",
            collapsed: true,
            prefix: /^$/,
            offset: 0,
          },
          () => {
            const contents = quill.getContents();

            if (
              contents.ops &&
              contents.ops.length === 1 &&
              contents.ops[0].insert === "\n" &&
              index > 0 // Check if the page is not the first one
            ) {
              // Remove the current page
              setPageCount((prevCount) => {
                const newCount = prevCount - 1;
                pageRefs.current.splice(index, 1); // Remove the page from refs
                quillInstances.current.splice(index, 1); // Remove the quill instance
                return newCount;
              });
            } else {
              return true; // Continue with default behavior if the page is not empty
            }
          }
        );
      }
    });
  }, [pageCount]);

  const handleAddPage = () => {
    setPageCount((prevCount) => prevCount + 1);
    pageRefs.current.push(null); // Add a new ref for the new page
  };

  const handlePrintContent = () => {
    const printWindow = window.open(
      "",
      "_blank",
      "left=100,top=100,width=600,height=600"
    );

    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Content</title>
            <link rel="stylesheet" href="https://cdn.quilljs.com/1.3.6/quill.snow.css">
            <style>
              body {
                font-family: Arial, sans-serif;
                padding: 20px;
              }
              .ql-editor {
                min-height: 11in;
                font-size: 14pt;
                line-height: 1.6;
              }
            </style>
          </head>
          <body>
            ${quillInstances.current
              .map(
                (quillInstance) =>
                  `<div class="ql-editor">${quillInstance.root.innerHTML}</div>`
              )
              .join("")}
          </body>
        </html>
      `);
      printWindow.focus();
      printWindow.print();
      printWindow.document.close();
    }
  };
  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    quillInstances.current.forEach((quillInstance, index) => {
      if (index > 0) {
        doc.addPage();
      }
      
      const content = quillInstance.root.innerHTML;
      
      doc.html(content, {
        callback: function (doc: { save: (arg0: string) => void; }) {
          if (index === quillInstances.current.length - 1) {
            doc.save('document.pdf');
          }
        },
        x: 10,
        y: 10,
        width: 190,
        windowWidth: 794
      });
    });
  };

  return (
    <Box bg="gray.50" minHeight="100vh" p={4}>
      <DocumentHeader
        documentTitle="My Document"
        collaborators={mockCollaborators}
        onToggleCall={handleToggleCall}
      />
      {isCallActive && isCallVisible && (
        <VoiceCallInterface
          participants={mockParticipants}
          onMute={handleMute}
          onEndCall={handleEndCall}
          onHideCall={handleToggleCall}
        />
      )}
      <Center>
        <Box width="11.5in" p={8} mt={4}>
          {Array.from({ length: pageCount }).map((_, index) => (
            <Box
              key={index}
              bg="white"
              shadow="md"
              p={8}
              borderRadius="md"
              border="1px solid #e0e0e0"
              position="relative"
              mb={4}
              onClick={() => handleFocusEditor(index)} // Trigger focus
            >
              {/* Remove Page Button */}
              {index > 0 && (
                <IconButton
                  icon={<MinusIcon />}
                  aria-label="Remove Page"
                  position="absolute"
                  top={2}
                  right={2}
                  size="sm"
                  colorScheme="red"
                  onClick={() => handleRemovePage(index)}
                />
              )}
              <Box
                ref={(el) => (pageRefs.current[index] = el)}
                minHeight="11in"
                p={2} // Adjust padding as needed
                bg="white"
                border="1px solid #e0e0e0"
                borderRadius="md"
                fontSize="14pt"
                lineHeight="1.6"
                boxShadow="0 0 10px rgba(0, 0, 0, 0.1)"
                cursor="text"
              />
            </Box>
          ))}

          <Button mt={4} colorScheme="blue" onClick={handleAddPage}>
            Add New Page
          </Button>
          <Button mt={4} ml={4} colorScheme="blue" onClick={handlePrintContent}>
            Print Content
          </Button>
          <Button mt={4} ml={4} colorScheme="green" onClick={handleExportPDF}>
            Export as PDF
          </Button>
        </Box>
      </Center>
    </Box>
  );
};

export default DocumentEditorPage;
