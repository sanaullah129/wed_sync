import { z } from "zod";

const eventType = z.enum(["ROKA", "ENGAGEMENT", "MEHENDI", "HALDI", "SANGEET", "COCKTAIL", "WEDDING", "RECEPTION", "CUSTOM"]);
const isoDateTime = z.string().datetime({ offset: true });

const eventFields = {
  name: z.string().trim().min(1).max(200),
  type: eventType.optional(),
  startsAt: isoDateTime,
  endsAt: isoDateTime.nullable().optional(),
  venueName: z.string().trim().max(200).optional(),
  address: z.string().trim().max(500).optional(),
  description: z.string().trim().max(2000).optional(),
  dressCode: z.string().trim().max(200).optional(),
};

function validateTimes<T extends { startsAt?: string; endsAt?: string | null }>(value: T, context: z.RefinementCtx) {
  if (value.startsAt && value.endsAt && new Date(value.endsAt) <= new Date(value.startsAt)) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["endsAt"], message: "End time must be after start time." });
  }
}

export const createEventSchema = z.object(eventFields).superRefine(validateTimes);
export const updateEventSchema = z.object({
  name: eventFields.name.optional(),
  type: eventType.nullable().optional(),
  startsAt: eventFields.startsAt.optional(),
  endsAt: eventFields.endsAt,
  venueName: eventFields.venueName,
  address: eventFields.address,
  description: eventFields.description,
  dressCode: eventFields.dressCode,
}).refine((value) => Object.keys(value).length > 0, "At least one field is required.");
