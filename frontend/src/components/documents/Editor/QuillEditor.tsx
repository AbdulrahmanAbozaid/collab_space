import React, { useEffect, useMemo, useRef } from "react";
import { Box, Center } from "@chakra-ui/react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import QuillCursors from "quill-cursors";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { QuillBinding } from "y-quill";

Quill.register("modules/cursors", QuillCursors);

// Move to env vars for production
const proto = location.protocol === "https:" ? "wss" : "ws";
const SIGNALING_URL =
  `${proto}://${location.host}/signaling` || "ws://localhost:4444";

const FORMATS = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video",
  "code-block",
  "color",
  "background",
  "size",
  "direction",
  "align",
  "formula",
];

const colorFor = (name: string) => {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) % 360;
  return `hsl(${h}, 70%, 45%)`;
};

interface QuillEditorProps {
  username: string;
  docId: string;
}

const QuillEditor: React.FC<QuillEditorProps> = ({ username, docId }) => {
  const quillRef = useRef<ReactQuill>(null);

  // Stable object: a new `modules` every render makes Quill re-initialise
  const modules = useMemo(
    () => ({
      toolbar: { container: "#toolbar" },
      history: { maxStack: 500, userOnly: true },
      cursors: true,
    }),
    [],
  );

  useEffect(() => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;

    // Everything is created per effect run, so cleanup can't leave a dead shared doc behind
    const ydoc = new Y.Doc();
    const ytext = ydoc.getText("quill");
    const provider = new WebrtcProvider(`doc_${docId}`, ydoc, {
      signaling: [SIGNALING_URL],
    });
    // Use the provider's OWN awareness (don't replace it) so cursors actually sync
    provider.awareness.setLocalStateField("user", {
      name: username,
      color: colorFor(username),
    });
    const binding = new QuillBinding(ytext, quill, provider.awareness);

    return () => {
      binding.destroy();
      provider.destroy();
      ydoc.destroy();
    };
  }, [docId, username]);

  return (
    <>
      <Box
        id="toolbar"
        bg="#edf2fa"
        borderRadius="2rem"
        my={2}
        p={2}
        w="100%"
        position="sticky"
        top="5rem"
        zIndex={10}
        sx={{
          "&.ql-toolbar.ql-snow": { border: "none" },
          ".ql-formats": {
            display: "inline-flex",
            gap: "1rem",
            marginRight: "1.5rem",
          },
        }}
      >
        <span className="ql-formats">
          <button className="ql-bold" />
          <button className="ql-italic" />
          <button className="ql-underline" />
          <button className="ql-strike" />
        </span>
        <span className="ql-formats">
          <button className="ql-blockquote" />
          <button className="ql-code-block" />
          <button className="ql-link" />
          <button className="ql-image" />
          <button className="ql-video" />
          <button className="ql-formula" />
        </span>
        <span className="ql-formats">
          <select className="ql-header" defaultValue="">
            <option value="1" />
            <option value="2" />
            <option value="3" />
            <option value="" />
          </select>
          <button className="ql-list" value="ordered" />
          <button className="ql-list" value="bullet" />
        </span>
        <span className="ql-formats">
          <button className="ql-indent" value="-1" />
          <button className="ql-indent" value="+1" />
          <button className="ql-direction" value="rtl" />
        </span>
        <span className="ql-formats">
          <select className="ql-size" defaultValue="">
            <option value="small">Small</option>
            <option value="">Normal</option>
            <option value="large">Large</option>
            <option value="huge">Huge</option>
          </select>
          <select className="ql-color" />
          <select className="ql-background" />
        </span>
        <span className="ql-formats">
          <button className="ql-clean" />
        </span>
      </Box>

      <Center flexDirection="column" px={{ lg: "4rem" }} mt={4}>
        <Box bg="white" border="1px solid #acacac" position="relative" w="100%">
          {/* UNCONTROLLED on purpose: no value/onChange. y-quill owns the content. */}
          <ReactQuill
            ref={quillRef}
            theme="snow"
            modules={modules}
            formats={FORMATS}
            className="custom-editor"
          />
        </Box>
      </Center>
    </>
  );
};

export default QuillEditor;
