import { User, Session } from "@/server/db/models";
import { connectToDatabase } from "@/server/db/mongoose";
import { hashPassword } from "@/server/auth/password";
import { createToken, hashToken } from "@/server/auth/tokens";
import { setSessionCookie } from "@/server/auth/cookies";
import { dataResponse } from "@/server/http/responses";
import { AppError, errorResponse } from "@/server/http/errors";
import { signupSchema } from "@/modules/auth/auth.schemas";

export async function POST(request: Request) {
  try {
    const input = signupSchema.parse(await request.json());
    await connectToDatabase();
    const emailNormalized = input.email.toLowerCase();
    if (await User.exists({ emailNormalized })) throw new AppError("EMAIL_ALREADY_EXISTS", "An account already exists for this email.", 409);
    const user = await User.create({ ...input, email: input.email.trim(), emailNormalized, passwordHash: await hashPassword(input.password) });
    const token = createToken();
    await Session.create({ userId: user._id, tokenHash: hashToken(token), expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) });
    await setSessionCookie(token);
    return dataResponse({ user: { id: user._id, name: user.name, email: user.email }, hasWedding: false }, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
