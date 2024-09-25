import React, { useRef, useState, useEffect } from "react";
import DocumentHeader from "../../components/documents/DocumentHeader";
import VoiceCallInterface from "../../components/documents/VoiceCall";
import { Box, Center, Button, IconButton } from "@chakra-ui/react";
import { MinusIcon } from "@chakra-ui/icons";
// @ts-ignore
import html2pdf from "html2pdf.js";
import { useParams } from "react-router-dom";
// Quill
import * as Y from "yjs";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { QuillBinding } from "y-quill";
import { WebrtcProvider } from "y-webrtc";
import QuillCursors from "quill-cursors";

const DocumentEditorPage: React.FC = () => {
  const [isCallActive, _] = useState(true);
  const [isCallVisible, setIsCallVisible] = useState(true);
  const [pageCount, setPageCount] = useState(1);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const quillInstances = useRef<Quill[]>([]);
  const { id } = useParams<{ id: string }>(); // For link sharing, using document ID
  Quill.register("modules/cursors", QuillCursors);

  // Create a new Yjs document and Y.Text for the Quill editor
  const ydoc = useRef<Y.Doc>(new Y.Doc());
  const yText = useRef<Y.Text>(ydoc.current.getText("quill-content"));

  const handleRemovePage = (index: number) => {
    if (index > 0) {
      setPageCount((prevCount) => {
        pageRefs.current.splice(index, 1);
        quillInstances.current.splice(index, 1);
        return prevCount - 1;
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
          //   cursors: true,
          theme: "snow",
          placeholder: "Start collaborating...",
          history: {
            userOnly: true
          },
          modules: {
            toolbar: [
              [{ header: [1, 2, 3, false] }],
              ["bold", "italic", "underline"],
              [{ list: "ordered" }, { list: "bullet" }],
              ["link", "image"],
            ],
          },
        });

        // Setup Yjs WebRTC provider for peer-to-peer document syncing
        const provider = new WebrtcProvider(`document-${id}`, ydoc.current);

        // Bind Quill to the Yjs document using y-quill and Y.Text
        const binding = new QuillBinding(yText.current, quill);

        // Store the Quill instance
        //   quillInstances.current.push(quill);

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

        return () => {
          binding.destroy();
          provider.disconnect();
        };
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
            <title>Document</title>
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

  const handleExportPDF = async () => {
    try {
      // Create a container for all pages
      const container = document.createElement("div");

      // Add Quill styles and additional heading styles
      const styleSheet = document.createElement("style");
      styleSheet.textContent = `
        ${Quill.import("css")}
        .ql-editor {
          padding: 0;
        }
        .ql-editor h1 {
          font-size: 2em;
          font-weight: bold;
          margin-top: 0.67em;
          margin-bottom: 0.67em;
        }
        .ql-editor h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin-top: 0.83em;
          margin-bottom: 0.83em;
        }
        .ql-editor h3 {
          font-size: 1.17em;
          font-weight: bold;
          margin-top: 1em;
          margin-bottom: 1em;
        }
        .ql-editor h4 {
          font-size: 1em;
          font-weight: bold;
          margin-top: 1.33em;
          margin-bottom: 1.33em;
        }
        .ql-editor h5 {
          font-size: 0.83em;
          font-weight: bold;
          margin-top: 1.67em;
          margin-bottom: 1.67em;
        }
        .ql-editor h6 {
          font-size: 0.67em;
          font-weight: bold;
          margin-top: 2.33em;
          margin-bottom: 2.33em;
        }
      `;
      container.appendChild(styleSheet);

      // Add content from each Quill instance
      quillInstances.current.forEach((quill, _) => {
        const pageDiv = document.createElement("div");
        pageDiv.innerHTML = quill.root.innerHTML;
        pageDiv.className = "ql-editor";
        pageDiv.style.pageBreakAfter = "always";
        pageDiv.style.minHeight = "11in";
        pageDiv.style.padding = "1in";
        pageDiv.style.boxSizing = "border-box";
        container.appendChild(pageDiv);
      });

      // Use html2pdf to generate PDF
      const opt = {
        margin: 0,
        filename: "document-export.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      };

      html2pdf().from(container).set(opt).save();
    } catch (error) {
      console.error("Error exporting PDF:", error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  return (
    <Box bg="gray.50" minHeight="100vh" p={4}>
      <DocumentHeader
        documentTitle="My Document"
        collaborators={[]}
        onToggleCall={() => setIsCallVisible(!isCallVisible)}
      />
      {isCallActive && isCallVisible && (
        <VoiceCallInterface
          participants={[]}
          onMute={() => 1}
          onEndCall={() => 1}
          onHideCall={() => 1}
        />
      )}
      <Center>
        <Box width="13.5in" p={8} mt={4}>
          {Array.from({ length: pageCount }).map((_, index) => (
            <Box
              key={index}
              bg="white"
              shadow="md"
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
