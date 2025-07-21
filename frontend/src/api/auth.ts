// export async function loginUser(username: string, password: string): Promise<string> {
//   const res = await fetch("/api/login", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ username, password }),
//   });

//   if (!res.ok) throw new Error("Login failed");
//   const data = await res.json();
//   return data.token; // or adjust to match your API response
// }

export async function loginUser(username: string, password: string): Promise<string> {
  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) throw new Error("Login failed");
  const data = await res.json();
  console.log("data="+data);
  return data.access_token; // <-- fixed here
}
