import { Box, Flex } from "@chakra-ui/react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";
import Header from "../common/DashHeader";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import cookies from "../../utils/cookies";
import { restoreUser } from "../../redux/auth/Thunks/UserThunk";

const DashboardLayout = () => {
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
      {/* Header at the top, taking full width */}
      <Header />

      {/* Main content section under the header and sidebar */}
      <Flex flex="1">
        <Sidebar />
        <Box
          flex="1"
          p={4}
          ml={{ base: 0, md: "240px" }} // Start content after sidebar
          mt={"64px"} // Adjust top margin to start after header
          overflowY="auto"
        >
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  );
};

export default DashboardLayout;
