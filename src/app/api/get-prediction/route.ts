import { type NextRequest } from "next/server";
import { z } from "zod";

const schema = z.object({
  env_id: z.string().uuid(),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const env_id = searchParams.get("env_id");

    const { error, data: parsed_data } = schema.safeParse({
      env_id,
    });

    if (error) throw new ReferenceError("Env ID and datetime are required!");

    const res = await fetch(
      `${process.env.FASTAPI_URL}/predict?env_id=${parsed_data.env_id}`,
      {
        next: {
          revalidate: 60,
        },
      },
    );

    if (!res.ok) throw new Error("Unexpected error has occurred!");

    const data = await res.json();

    return Response.json(data);
  } catch (error) {
    console.log(error);

    if (error instanceof ReferenceError)
      return Response.json(
        {
          message: error.message,
        },
        { status: 404 },
      );

    return Response.json(
      {
        message: "Unexpected error has occurred!",
      },
      { status: 500 },
    );
  }
}
