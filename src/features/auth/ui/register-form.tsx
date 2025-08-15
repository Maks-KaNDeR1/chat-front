import React, {useState} from "react";
import {useRouter} from "next/router";
import {useSnackbar} from "notistack";
import {Form, Button, Container, Row, Col} from "react-bootstrap";
import {AuthPayload, useAuthStatus} from "../model";
import {register} from "../api";

export const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [validated, setValidated] = useState(false);
  const router = useRouter();
  const {enqueueSnackbar} = useSnackbar();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidated(true);

    if (!username || !password) {
      enqueueSnackbar("Пожалуйста, заполните все поля.", {variant: "error"});
      return;
    }

    const data = await register({username, password});

    if (data.status) {
      enqueueSnackbar("Регистрация успешна!", {variant: "success"});
      localStorage.setItem("token", data.result);

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
          <h2 className="text-center mb-4">Регистрация</h2>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group controlId="formUsername" className="mb-3">
              <Form.Label>Имя пользователя</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Введите имя пользователя"
                className="rounded-5"
                value={username}
                onChange={e => setUsername(e.target.value)}
                isInvalid={validated && !username}
              />
              <Form.Control.Feedback type="invalid">
                Пожалуйста, введите имя пользователя.
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
                Пожалуйста, введите пароль.
              </Form.Control.Feedback>
            </Form.Group>

            <Button variant="outline-secondary" type="submit" className="w-100">
              Зарегистрироваться
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};
