import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    
    if (!session || !session.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    return Response.json({
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
    });
  } catch (error) {
    console.error("Error retrieving current user:", error);
    return Response.json(
      { error: "Failed to retrieve user information" },
      { status: 500 }
    );
  }
} 