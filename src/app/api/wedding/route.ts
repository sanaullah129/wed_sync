import { requireCurrentUser, requireMembership } from "@/server/auth/session";
import { createWedding } from "@/modules/wedding/wedding.service";
import { weddingSchema } from "@/modules/auth/auth.schemas";
import { Wedding } from "@/server/db/models";
import { connectToDatabase } from "@/server/db/mongoose";
import { dataResponse } from "@/server/http/responses";
import { errorResponse } from "@/server/http/errors";

export async function POST(request: Request) {
  try {
    const user = await requireCurrentUser();
    const wedding = await createWedding(user._id, weddingSchema.parse(await request.json()));
    return dataResponse(wedding ? { id: wedding._id, ...wedding.toObject(), gallery: undefined } : null, 201);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function GET() {
  try {
    const { membership } = await requireMembership();
    if (!membership) return dataResponse(null);
    await connectToDatabase();
    const wedding = await Wedding.findOne({ _id: membership.weddingId, deletedAt: null }).select("-gallery.token").lean();
    return dataResponse(wedding);
  } catch (error) {
    return errorResponse(error);
  }
}
