import {useRouter} from "next/router";
import {useSnackbar} from "notistack";
import React, {useState} from "react";
import {Form, Button, Container, Row, Col} from "react-bootstrap";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validated, setValidated] = useState(false);
  const router = useRouter();
  const {enqueueSnackbar} = useSnackbar();

  const correctEmail = "teat@mail.ru";
  const correctPassword = "12345";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidated(true);

    if (!email || !password) {
      enqueueSnackbar("Please fill in all fields.", {variant: "error", persist: true});
      return;
    }

    if (email === correctEmail && password === correctPassword) {
      enqueueSnackbar("Successful login!", {variant: "success"});
      router.push("/");
    } else {
      enqueueSnackbar("Incorrect email or password.", {variant: "error"});
    }
  };

  return (
    <Container className="max-w-sm mx-auto">
      <Row className="justify-content-md-center mt-5">
        <Col xs={12} md={5} lg={4}>
          <h2 className="text-center mb-4">Login</h2>

          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                required
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                isInvalid={validated && !email}
              />
              <Form.Control.Feedback type="invalid">
                Please enter your email.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formPassword" className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                required
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                isInvalid={validated && !password}
              />
              <Form.Control.Feedback type="invalid">
                Please enter your password.
              </Form.Control.Feedback>
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Login
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};
