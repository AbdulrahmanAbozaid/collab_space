import { Container } from "@chakra-ui/react";
import Header from "../common/Header";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../redux/hooks";
import { useEffect } from "react";
import cookies from "../../utils/cookies";
import { restoreUser } from "../../redux/auth/Thunks/UserThunk";

export default function AuthLayout() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (cookies.get("clb-tkn")) {
      // Restore user Data
      dispatch(restoreUser());
      navigate("/collab");
    }
  }, []);

  return (
    <Container
      maxW={"container.xl"}
      pt={"4.2rem"}
      minH={"100svh"}
      display={"flex"}
      justifyContent={"flex-start"}
      alignItems={"center"}
    >
      <Header />
      <Outlet />
    </Container>
  );
}
