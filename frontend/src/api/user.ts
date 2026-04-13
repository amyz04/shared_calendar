import { getToken } from "./auth";

const BASE_URL = "http://localhost:8080/api";

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

export async function updateProfileApi(data: {
  email?: string;
  avatarColor?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
}) {
  const res = await fetch(`${BASE_URL}/user/profile`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update profile");
  return res.json();
}