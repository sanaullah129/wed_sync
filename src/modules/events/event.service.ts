import mongoose from "mongoose";
import { Event } from "@/server/db/models";
import { AppError } from "@/server/http/errors";
import type { z } from "zod";
import type { createEventSchema, updateEventSchema } from "./event.schemas";

function ensureId(id: string) {
  if (!mongoose.isValidObjectId(id)) throw new AppError("VALIDATION_ERROR", "Invalid event ID.", 400);
  return new mongoose.Types.ObjectId(id);
}

export async function listEvents(weddingId: mongoose.Types.ObjectId, includeArchived: boolean) {
  return Event.find({ weddingId, ...(includeArchived ? {} : { archivedAt: null }) }).sort({ startsAt: 1, _id: 1 }).lean();
}

export async function createEvent(weddingId: mongoose.Types.ObjectId, input: z.infer<typeof createEventSchema>) {
  return Event.create({ ...input, weddingId, endsAt: input.endsAt ?? null, archivedAt: null });
}

export async function getEvent(weddingId: mongoose.Types.ObjectId, eventId: string) {
  const event = await Event.findOne({ _id: ensureId(eventId), weddingId }).lean();
  if (!event) throw new AppError("NOT_FOUND", "Event not found.", 404);
  return event;
}

export async function updateEvent(weddingId: mongoose.Types.ObjectId, eventId: string, input: z.infer<typeof updateEventSchema>) {
  const id = ensureId(eventId);
  const current = await Event.findOne({ _id: id, weddingId });
  if (!current) throw new AppError("NOT_FOUND", "Event not found.", 404);
  if (current.archivedAt) throw new AppError("CONFLICT", "Archived events are read-only.", 409);

  const merged = { startsAt: input.startsAt ?? current.startsAt.toISOString(), endsAt: input.endsAt === undefined ? current.endsAt?.toISOString() ?? null : input.endsAt };
  if (merged.endsAt && new Date(merged.endsAt) <= new Date(merged.startsAt)) throw new AppError("VALIDATION_ERROR", "End time must be after start time.", 400, { endsAt: "End time must be after start time." });

  const updated = await Event.findOneAndUpdate(
    { _id: id, weddingId, __v: current.__v },
    { $set: input, $inc: { __v: 1 } },
    { new: true, runValidators: true },
  ).lean();
  if (!updated) throw new AppError("CONFLICT", "The event changed while you were editing it.", 409);
  return updated;
}

export async function archiveEvent(weddingId: mongoose.Types.ObjectId, eventId: string) {
  const updated = await Event.findOneAndUpdate({ _id: ensureId(eventId), weddingId, archivedAt: null }, { $set: { archivedAt: new Date() } }, { new: true }).lean();
  if (!updated) throw new AppError("NOT_FOUND", "Event not found.", 404);
  return updated;
}
