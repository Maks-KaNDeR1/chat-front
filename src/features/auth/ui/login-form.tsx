import React, {useState} from "react";
import {useRouter} from "next/router";
import {useSnackbar} from "notistack";
import {Form, Button, Container, Row, Col} from "react-bootstrap";
import {login} from "../api";
import {AuthPayload, useAuthStatus, useAuthStore} from "../model";
import { getUserByToken } from "@/src/entities/user/api";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validated, setValidated] = useState(false);
  const router = useRouter();
  const {enqueueSnackbar} = useSnackbar();
  const setUser = useAuthStore(state => state.setUser);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidated(true);

    if (!email || !password) {
      enqueueSnackbar("Пожалуйста, заполните все поля.", {variant: "error"});
      return;
    }

    const payload: AuthPayload = {username: email, password};
    const data = await login(payload);

    if (data.status) {
      enqueueSnackbar("Успешный вход!", {variant: "success"});
      localStorage.setItem("token", data.result);

      getUserByToken(data.result)
      .then(me => {
        if (!me) return;

        setUser(me.data, data.result);
      });

      useAuthStatus.getState().setAuthorized(true);
      router.push("/");
    } else {
      enqueueSnackbar(data.error, {variant: "error"});
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
                type="email"
                placeholder="Введите email"
                className="rounded-5"
                value={email}
                onChange={e => setEmail(e.target.value)}
                isInvalid={validated && !email}
              />
              <Form.Control.Feedback type="invalid">
                Пожалуйста, введите ваш email.
              </Form.Control.Feedback>
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

            <Button variant="outline-secondary" type="submit" className="w-100">
              Войти
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};
