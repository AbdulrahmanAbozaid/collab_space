import { ChakraProvider } from "@chakra-ui/react";
import { AppRoutes } from "./router";
import { BrowserRouter } from "react-router-dom";
import theme from "../lib/chakraUi/theme";
import '../styles/index.css';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
