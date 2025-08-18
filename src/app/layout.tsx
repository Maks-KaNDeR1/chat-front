import React, {ReactNode} from "react";
import {Container, Spinner} from "react-bootstrap";
import {Header} from "../widgets/layout";
import {useLoadingStore} from "../shared/store";

type Props = {
  children: ReactNode;
};

export const Layout = ({children}: Props) => {
  const isLoading = useLoadingStore(state => state.isLoading);

  return (
    <>
      {isLoading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(255, 255, 255, 0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <Spinner
            animation="border"
            variant="secondary"
            style={{width: 50, height: 50}}
          />
        </div>
      )}

      <Header />
      <Container fluid className="mt-3 h-100">
        {children}
      </Container>
    </>
  );
};
