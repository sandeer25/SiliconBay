type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const origin = new URL(request.url).origin;
    const response = await fetch(`${origin}/api/backend/products/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    return Response.json(data);
  } catch (error) {
    return new Response("Failed to fetch product", { status: 500 });
  }
}
