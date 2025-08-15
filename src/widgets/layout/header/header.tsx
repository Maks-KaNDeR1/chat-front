import React from "react";
import {Navbar, Button} from "react-bootstrap";
import {UserMenu} from "../user";
import {useAuthStatus, useAuthStore} from "@/src/features/auth";

export const Header = () => {
  const {user} = useAuthStore();
  const {isAuthorized} = useAuthStatus();

  return (
    <Navbar
      variant="light"
      style={{backgroundColor: "#d5d5d5", padding: "0 20px"}}
      expand="lg"
    >
      <Navbar.Brand href="/">O AI</Navbar.Brand>
      <div
        style={{marginLeft: "auto", display: "flex", alignItems: "center", gap: "12px"}}
      >
        {isAuthorized && user ? (
          <UserMenu user={user} />
        ) : (
          <>
            <Button href="/login" variant="outline-dark" size="sm">
              Войти
            </Button>
            <Button href="/register" variant="dark" size="sm">
              Зарегистрироваться
            </Button>
          </>
        )}
      </div>
    </Navbar>
  );
};
