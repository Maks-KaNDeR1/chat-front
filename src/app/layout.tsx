import React, {ReactNode} from "react";
import {Container, Navbar, Button} from "react-bootstrap";

type User = {
  name: string;
  avatarUrl?: string;
};

type Props = {
  children: ReactNode;
  user?: User | null;
  onLoginClick?: () => void;
  onRegisterClick?: () => void;
};

export const Layout = ({children}: Props) => {
  const user = {
    avatarUrl: "",
    name: "maks",
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" style={{padding: "0 20px"}}>
        <Navbar.Brand href="/">O AI</Navbar.Brand>

        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          {user ? (
            <>
              {user.avatarUrl && (
                <img
                  src={user.avatarUrl}
                  alt="avatar"
                  style={{width: 32, height: 32, borderRadius: "50%"}}
                />
              )}
              <span style={{color: "white"}}>{user.name}</span>
            </>
          ) : (
            <>
              <Button href="/login" variant="outline-light" size="sm">
                Log in
              </Button>
              <Button variant="light" size="sm" onClick={() => {}}>
                Registration
              </Button>
            </>
          )}
        </div>
      </Navbar>
      <Container fluid className="mt-4">
        {children}
        </Container>
    </>
  );
};
