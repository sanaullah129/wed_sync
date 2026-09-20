import { requireMembership } from "@/server/auth/session";
import { updateEventSchema } from "@/modules/events/event.schemas";
import { archiveEvent, getEvent, updateEvent } from "@/modules/events/event.service";
import { dataResponse } from "@/server/http/responses";
import { errorResponse } from "@/server/http/errors";

type Context = { params: Promise<{ eventId: string }> };

export async function GET(_request: Request, context: Context) {
  try {
    const { membership } = await requireMembership();
    if (!membership) return dataResponse(null, 404);
    return dataResponse(await getEvent(membership.weddingId, (await context.params).eventId));
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: Request, context: Context) {
  try {
    const { membership } = await requireMembership();
    if (!membership) return dataResponse(null, 404);
    return dataResponse(await updateEvent(membership.weddingId, (await context.params).eventId, updateEventSchema.parse(await request.json())));
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_request: Request, context: Context) {
  try {
    const { membership } = await requireMembership();
    if (!membership) return dataResponse(null, 404);
    await archiveEvent(membership.weddingId, (await context.params).eventId);
    return dataResponse({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
