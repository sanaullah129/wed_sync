import { requireMembership } from "@/server/auth/session";
import { createEventSchema } from "@/modules/events/event.schemas";
import { createEvent, listEvents } from "@/modules/events/event.service";
import { dataResponse } from "@/server/http/responses";
import { AppError, errorResponse } from "@/server/http/errors";

export async function GET(request: Request) {
  try {
    const { membership } = await requireMembership();
    if (!membership) return dataResponse([]);
    const includeArchived = new URL(request.url).searchParams.get("includeArchived") === "true";
    return dataResponse(await listEvents(membership.weddingId, includeArchived));
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const { membership } = await requireMembership();
    if (!membership) return errorResponse(new AppError("CONFLICT", "Create or join a wedding before adding events.", 409));
    const event = await createEvent(membership.weddingId, createEventSchema.parse(await request.json()));
    return dataResponse(event, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
