import { Session, User, WeddingMembership } from "@/server/db/models";
import { AppError } from "@/server/http/errors";
import { readSessionCookie } from "./cookies";
import { hashToken } from "./tokens";
import { connectToDatabase } from "@/server/db/mongoose";

export async function requireCurrentUser() {
  await connectToDatabase();
  const rawToken = await readSessionCookie();
  if (!rawToken) throw new AppError("UNAUTHENTICATED", "Authentication is required.", 401);

  const session = await Session.findOneAndUpdate(
    { tokenHash: hashToken(rawToken), expiresAt: { $gt: new Date() } },
    { $set: { lastUsedAt: new Date() } },
    { new: true },
  ).lean();
  if (!session) throw new AppError("UNAUTHENTICATED", "Authentication is required.", 401);

  const user = await User.findById(session.userId).lean();
  if (!user) throw new AppError("UNAUTHENTICATED", "Authentication is required.", 401);
  return user;
}

export async function requireMembership() {
  const user = await requireCurrentUser();
  const membership = await WeddingMembership.findOne({ userId: user._id }).lean();
  return { user, membership };
}
