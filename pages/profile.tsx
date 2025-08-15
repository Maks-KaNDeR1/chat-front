import {NextPage} from "next";
import Head from "next/head";
import React, {useState, ChangeEvent, useRef} from "react";
import {Container, Form, Button, Image} from "react-bootstrap";
import {X} from "react-bootstrap-icons";

type User = {
  name: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
};

const ProfilePage: NextPage = () => {
  const [user, setUser] = useState<User>({
    name: "Maks",
    email: "maks@test.com",
    phone: "+123456789",
    avatarUrl: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setUser(prev => ({...prev, [name]: value}));
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser(prev => ({...prev, avatarUrl: reader.result as string}));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setUser(prev => ({...prev, avatarUrl: ""}));
  };

  const handleSave = () => {};

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
              {user.avatarUrl ? (
                <>
                  <Image
                    src={user.avatarUrl}
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
                  {user.name[0]?.toUpperCase()}
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
              name="name"
              value={user.name}
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
              value={user.email}
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
              value={user.phone}
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
