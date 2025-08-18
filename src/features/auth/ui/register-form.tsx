import React, {useState, useRef} from "react";
import {useRouter} from "next/router";
import {useSnackbar} from "notistack";
import {Form, Button, Container, Row, Col, Spinner} from "react-bootstrap";
import {register} from "../api";
import {getUserByToken} from "@/src/entities/user/api";
import {useAuthStore} from "../model";

export const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {enqueueSnackbar} = useSnackbar();
  const setUser = useAuthStore(state => state.setUser);

  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username || !password) {
      enqueueSnackbar("Пожалуйста, заполните все поля.", {variant: "error"});
      buttonRef.current?.scrollIntoView({behavior: "smooth", block: "center"});
      return;
    }

    setLoading(true);
    try {
      const data = await register({username, password});

      if (data.success) {
        enqueueSnackbar("Регистрация успешна!", {variant: "success"});
        localStorage.setItem("token", data.result);
        router.push("/");

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
          <h2 className="text-center mb-4">Регистрация</h2>
          <Form noValidate onSubmit={handleSubmit}>
            <Form.Group controlId="formUsername" className="mb-3">
              <Form.Label>Имя пользователя</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Введите имя пользователя"
                className="rounded-5"
                value={username}
                onChange={e => setUsername(e.target.value)}
                isInvalid={!username}
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
                isInvalid={!password}
              />
              <Form.Control.Feedback type="invalid">
                Пожалуйста, введите пароль.
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
                  Регистрация...
                </>
              ) : (
                "Зарегистрироваться"
              )}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};
