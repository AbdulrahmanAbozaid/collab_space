import {
  Box,
  Flex,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  DrawerBody,
} from "@chakra-ui/react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";
import DashHeader from "../common/DashHeader";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { restoreUser } from "../../redux/auth/Thunks/UserThunk";
import cookies from "../../utils/cookies";
import { useEffect } from "react";

const DashboardLayout = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { token } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!token) {
      if (!cookies.get("clb-tkn")) navigate("/login");
      else {
        // Restore user Data
        dispatch(restoreUser());
      }
    }
  }, [token]);

  return (
    <Flex direction="column" h="100vh">
      {/* Header */}
      <DashHeader onSidebarOpen={onOpen} />

      {/* Main content with responsive sidebar */}
      <Flex flex="1">
        {/* Sidebar for desktop */}
        <Box
          bg={"white"}
          display={{ base: "none", md: "block" }}
          pos="fixed"
          top="64px"
          h="calc(100vh - 64px)"
        >
          <Sidebar isMobile={false} onClose={onClose} />
        </Box>

        {/* Sidebar for mobile - using Chakra UI Drawer */}
        <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerBody pt={10}>
              <Sidebar isMobile={true} onClose={onClose} />
            </DrawerBody>
          </DrawerContent>
        </Drawer>

        {/* Main content */}
        <Box flex="1" p={4} ml={{ base: 0, md: "240px" }} mt="64px">
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  );
};

export default DashboardLayout;
