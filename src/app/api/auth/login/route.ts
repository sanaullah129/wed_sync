import { User, Session, WeddingMembership } from "@/server/db/models";
import { connectToDatabase } from "@/server/db/mongoose";
import { verifyPassword } from "@/server/auth/password";
import { createToken, hashToken } from "@/server/auth/tokens";
import { setSessionCookie } from "@/server/auth/cookies";
import { dataResponse } from "@/server/http/responses";
import { AppError, errorResponse } from "@/server/http/errors";
import { loginSchema } from "@/modules/auth/auth.schemas";

export async function POST(request: Request) {
  try {
    const input = loginSchema.parse(await request.json());
    await connectToDatabase();
    const user = await User.findOne({ emailNormalized: input.email.toLowerCase() });
    if (!user || !(await verifyPassword(user.passwordHash, input.password))) throw new AppError("INVALID_CREDENTIALS", "Invalid email or password.", 401);
    const token = createToken();
    await Session.create({ userId: user._id, tokenHash: hashToken(token), expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) });
    await setSessionCookie(token);
    return dataResponse({ user: { id: user._id, name: user.name, email: user.email }, hasWedding: Boolean(await WeddingMembership.exists({ userId: user._id })) });
  } catch (error) {
    return errorResponse(error);
  }
}
