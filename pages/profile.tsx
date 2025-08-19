import {NextPage} from "next";
import Head from "next/head";
import React, {useState, ChangeEvent, useRef, useEffect} from "react";
import {Container, Form, Button, Image} from "react-bootstrap";
import {X} from "react-bootstrap-icons";
import {useAuthStore} from "@/src/features/auth";

const ProfilePage: NextPage = () => {
  const {user, setUser} = useAuthStore();
  const [formUser, setFormUser] = useState(user);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setFormUser(user);
    }
  }, [user]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setFormUser(prev => (prev ? {...prev, [name]: value} : null));
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormUser(prev =>
          prev ? {...prev, avatarUrl: reader.result as string} : null
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setFormUser(prev => (prev ? {...prev, avatarUrl: ""} : null));
  };

  const handleSave = () => {
    if (formUser) {
      setUser(formUser);
    }
  };

  if (!formUser) return null;

  return (
    <>
      <Head>
        <title>Профиль</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <Container className="mt-4" style={{maxWidth: 600}}>
        <h2>Профиль</h2>

        <Form>
          <Form.Group className="mb-3">
            <div
              style={{
                position: "relative",
                width: 100,
                height: 100,
                marginBottom: 8,
              }}
            >
              {formUser.avatarUrl ? (
                <>
                  <Image
                    src={formUser.avatarUrl}
                    roundedCircle
                    width={100}
                    height={100}
                    style={{objectFit: "cover"}}
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleRemoveAvatar}
                    style={{
                      position: "absolute",
                      top: 7,
                      right: 7,
                      width: 16,
                      height: 16,
                      padding: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "50%",
                    }}
                  >
                    <X size={14} />
                  </Button>
                </>
              ) : (
                <div
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    backgroundColor: "#6c757d",
                    color: "white",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontWeight: "bold",
                    fontSize: 40,
                  }}
                >
                  {formUser.username[0]?.toUpperCase()}
                </div>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{display: "none"}}
              onChange={handleAvatarChange}
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline-secondary"
              size="sm"
            >
              Загрузить фото
            </Button>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="text-secondary" column="sm">
              Имя
            </Form.Label>
            <Form.Control
              className="rounded-5"
              name="username"
              value={formUser.username}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="text-secondary" column="sm">
              Email
            </Form.Label>
            <Form.Control
              className="rounded-5"
              name="email"
              value={formUser.email}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="text-secondary" column="sm">
              Телефон
            </Form.Label>
            <Form.Control
              className="rounded-5"
              name="phone"
              value={(formUser as any).phone || ""}
              onChange={handleChange}
            />
          </Form.Group>

          <Button variant="outline-secondary" onClick={handleSave}>
            Сохранить
          </Button>
        </Form>
      </Container>
    </>
  );
};

export default ProfilePage;
