import { requireMembership } from "@/server/auth/session";
import { dataResponse } from "@/server/http/responses";
import { errorResponse } from "@/server/http/errors";

export async function GET() {
  try {
    const { user, membership } = await requireMembership();
    return dataResponse({
      user: { id: user._id, name: user.name, email: user.email },
      membership: membership ? { id: membership._id, role: membership.role } : null,
      wedding: membership ? { id: membership.weddingId } : null,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
