"use client";

import React from "react";
import {Dropdown} from "react-bootstrap";
import {useRouter} from "next/router";
import {User} from "@/src/entities/user";
import {useAuthStore} from "@/src/features/auth";

type Props = {
  user: User;
};

export const UserMenu = ({user}: Props) => {
  const router = useRouter();
  const {logout} = useAuthStore(state => state);

  return (
    <Dropdown align="end">
      <Dropdown.Toggle
        as="div"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          cursor: "pointer",
          padding: "0 4px",
        }}
      >
        {user?.avatarUrl ? (
          <img
            src={user?.avatarUrl}
            alt="avatar"
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              backgroundColor: "#6c757d",
              color: "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: "bold",
              fontSize: 14,
            }}
          >
            {user.username?.[0]?.toUpperCase()}
          </div>
        )}
        <span style={{fontSize: 14, color: "#212529"}}>{user.username}</span>
      </Dropdown.Toggle>

      <Dropdown.Menu style={{minWidth: 220, padding: "10px", backgroundColor: "#fff"}}>
        <div style={{marginBottom: "8px"}}>
          <div
            style={{display: "flex", alignItems: "center", gap: "8px", marginBottom: 4}}
          >
            {user?.avatarUrl ? (
              <img
                src={user?.avatarUrl}
                alt="avatar"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  backgroundColor: "#6c757d",
                  color: "white",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontWeight: "bold",
                  fontSize: 14,
                }}
              >
                {user.username?.[0]?.toUpperCase()}
              </div>
            )}
            <div>
              <div style={{fontWeight: "bold", color: "#212529"}}>{user.username}</div>
              <div style={{fontSize: 12, color: "#495057"}}>Логин: {user.username}</div>
            </div>
          </div>
          <div style={{marginLeft: 40, fontSize: 12, color: "#495057"}}>
            Баланс: {user.balance ?? 0}
          </div>
        </div>

        <Dropdown.Divider />

        <Dropdown.Item
          onClick={() => router.push("/profile")}
          style={{backgroundColor: "transparent", color: "#212529"}}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#e9ecef")}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          Профиль
        </Dropdown.Item>

        <Dropdown.Item
          onClick={() => {
            const confirmed = window.confirm("Вы уверены, что хотите выйти?");
            if (confirmed) {
              logout();
              localStorage.removeItem("token");
            }
          }}
          style={{backgroundColor: "transparent", color: "#212529"}}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#e9ecef")}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          Выйти
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};
