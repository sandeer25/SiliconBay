export async function GET(request: Request) {
  try {
    const origin = new URL(request.url).origin;
    const response = await fetch(`${origin}/api/backend/products/best-sellers`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    return Response.json(data);
  } catch (error) {
    return new Response("Failed to fetch best seller products", { status: 500 });
  }
}
