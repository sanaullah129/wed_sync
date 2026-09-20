import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  password: z.string().min(8).max(128),
});

export const loginSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(128),
});

export const weddingSchema = z.object({
  brideName: z.string().trim().min(1).max(120),
  groomName: z.string().trim().min(1).max(120),
  title: z.string().trim().max(200).optional(),
  description: z.string().trim().max(2000).optional(),
  weddingDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  timeZone: z.string().trim().min(1).max(100),
  location: z.object({
    formattedAddress: z.string().trim().max(300).optional(),
    city: z.string().trim().max(120).optional(),
    state: z.string().trim().max(120).optional(),
    country: z.string().trim().max(120).optional(),
    latitude: z.number().finite().optional(),
    longitude: z.number().finite().optional(),
    googlePlaceId: z.string().trim().max(200).optional(),
  }).optional(),
});
