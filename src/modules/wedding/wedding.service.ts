import mongoose from "mongoose";
import { Wedding, WeddingMembership } from "@/server/db/models";
import { connectToDatabase } from "@/server/db/mongoose";
import { AppError } from "@/server/http/errors";
import { createToken } from "@/server/auth/tokens";
import type { z } from "zod";
import type { weddingSchema } from "@/modules/auth/auth.schemas";

function slugPart(value: string) {
  return value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export async function createWedding(userId: mongoose.Types.ObjectId, input: z.infer<typeof weddingSchema>) {
  await connectToDatabase();
  const existing = await WeddingMembership.exists({ userId });
  if (existing) throw new AppError("ALREADY_HAS_WEDDING", "This user already belongs to a wedding.", 409);

  const baseSlug = `${slugPart(input.brideName)}-${slugPart(input.groomName)}-${input.weddingDate.replaceAll("-", "")}`;
  const session = await mongoose.startSession();
  let createdWeddingId: mongoose.Types.ObjectId | null = null;
  try {
    await session.withTransaction(async () => {
      let slug = baseSlug;
      let suffix = 1;
      while (await Wedding.exists({ "website.slug": slug }).session(session)) {
        suffix += 1;
        slug = `${baseSlug}-${suffix}`;
      }
      const [wedding] = await Wedding.create([{
        ...input,
        createdByUserId: userId,
        website: { slug, theme: "CLASSIC", isPublished: false },
        gallery: { token: createToken(), isEnabled: true, guestUploadsEnabled: true },
        livestream: { isEnabled: false },
      }], { session });
      createdWeddingId = wedding._id;
      await WeddingMembership.create([{
        userId,
        weddingId: wedding._id,
        role: "ADMIN",
        joinedAt: new Date(),
      }], { session });
    });
    return createdWeddingId ? Wedding.findById(createdWeddingId) : null;
  } finally {
    await session.endSession();
  }
}
