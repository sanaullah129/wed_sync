import { Session } from "@/server/db/models";
import { connectToDatabase } from "@/server/db/mongoose";
import { clearSessionCookie, readSessionCookie } from "@/server/auth/cookies";
import { hashToken } from "@/server/auth/tokens";
import { successResponse } from "@/server/http/responses";
import { errorResponse } from "@/server/http/errors";

export async function POST() {
  try {
    await connectToDatabase();
    const token = await readSessionCookie();
    if (token) await Session.deleteOne({ tokenHash: hashToken(token) });
    await clearSessionCookie();
    return successResponse();
  } catch (error) {
    return errorResponse(error);
  }
}
