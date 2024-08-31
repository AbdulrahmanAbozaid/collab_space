import { Container } from "@chakra-ui/react";
import Header from "../common/Header";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
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
