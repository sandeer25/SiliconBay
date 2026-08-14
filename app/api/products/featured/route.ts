export async function GET(request: Request) {
  try {
    // Build an absolute URL using the request origin so server-side fetch
    // can reliably call the frontend proxy which forwards to the backend.
    const origin = new URL(request.url).origin;
    const response = await fetch(`${origin}/api/backend/products/featured`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    return Response.json(data);

  } catch (error) {
    return new Response("Failed to fetch featured products", { status: 500 });
  }
}
