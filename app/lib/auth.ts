export async function getCurrentUser() {
  try {
    const res = await fetch("http://localhost:8000/me", {
      credentials: "include", // 🔥 VERY IMPORTANT (sends cookies)
    });

    if (!res.ok) return null;

    return await res.json();
  } catch {
    return null;
  }
}