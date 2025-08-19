"use client";

import React, {useState, useRef} from "react";
import {useRouter} from "next/router";
import {useSnackbar} from "notistack";
import {Form, Button, Container, Row, Col, Spinner} from "react-bootstrap";
import {login} from "../api";
import {useAuthStore} from "../model";
import {getUserByToken} from "@/src/entities/user/api";

export const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {enqueueSnackbar} = useSnackbar();
  const {setUser, setIsAuthorization} = useAuthStore(state => state);

  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidated(true);

    if (!username || !password) {
      enqueueSnackbar("Пожалуйста, заполните все поля.", {variant: "error"});
      buttonRef.current?.scrollIntoView({behavior: "smooth", block: "center"});
      return;
    }

    setLoading(true);
    try {
      const data = await login({username, password});

      if (data.success) {
        localStorage.setItem("token", data.result);
        setIsAuthorization();
        router.push("/");
        enqueueSnackbar("Успешный вход!", {variant: "success"});

        const me = await getUserByToken(data.result);
        if (me) setUser(me.result);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="max-w-sm mx-auto">
      <Row className="justify-content-md-center mt-5">
        <Col xs={12} md={5} lg={4}>
          <h2 className="text-center mb-4">Вход</h2>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Введите логин"
                className="rounded-5"
                value={username}
                onChange={e => setUsername(e.target.value)}
                isInvalid={validated && !username}
              />
            </Form.Group>

            <Form.Group controlId="formPassword" className="mb-3">
              <Form.Label>Пароль</Form.Label>
              <Form.Control
                required
                type="password"
                placeholder="Введите пароль"
                className="rounded-5"
                value={password}
                onChange={e => setPassword(e.target.value)}
                isInvalid={validated && !password}
              />
              <Form.Control.Feedback type="invalid">
                Пожалуйста, введите ваш пароль.
              </Form.Control.Feedback>
            </Form.Group>

            <Button
              ref={buttonRef}
              variant="outline-secondary"
              type="submit"
              className="w-100"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Вход...
                </>
              ) : (
                "Войти"
              )}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};
