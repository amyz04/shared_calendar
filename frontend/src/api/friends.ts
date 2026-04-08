const BASE_URL = "http://localhost:8080";

function authHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// Invite by email — works even if they don't have an account yet
export async function inviteByEmail(email: string) {
  const res = await fetch(
    `${BASE_URL}/api/friends/invite?email=${encodeURIComponent(email)}`,
    {
      method: "POST",
      headers: authHeaders(),
    }
  );
  if (!res.ok) throw new Error("Failed to send invite");
  return res.json();
}

// Get sent invites where invitee has no account yet
export async function getSentInvites() {
  const res = await fetch(`${BASE_URL}/api/friends/sent`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch sent invites");
  return res.json();
}

// Get all friendships (pending + accepted) for current user
export async function getFriendships() {
  const res = await fetch(`${BASE_URL}/api/friends`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch friends");
  return res.json();
}

// Accept or decline a friendship
export async function updateFriendship(friendshipId: string, status: "ACCEPTED" | "REJECTED") {
  const res = await fetch(`${BASE_URL}/api/friends/${friendshipId}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update friendship");
  return res.json();
}

// Delete a friendship
export async function deleteFriendship(friendshipId: string) {
  const res = await fetch(`${BASE_URL}/api/friends/${friendshipId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete friendship");
}