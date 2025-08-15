import React, {ReactNode} from "react";
import {Container} from "react-bootstrap";
import {Header} from "../widgets/layout";

type Props = {
  children: ReactNode;
};

export const Layout = ({children}: Props) => {
  return (
    <>
      <Header />
      <Container fluid className="mt-3">
        {children}
      </Container>
    </>
  );
};
