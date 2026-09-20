import mongoose, { Schema, type InferSchemaType } from "mongoose";

const timestamps = { timestamps: true };

const userSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true },
  emailNormalized: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
}, timestamps);

const sessionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  tokenHash: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true, index: true },
  lastUsedAt: { type: Date },
}, timestamps);
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const weddingSchema = new Schema({
  brideName: { type: String, required: true, trim: true },
  groomName: { type: String, required: true, trim: true },
  title: { type: String, trim: true },
  description: { type: String, trim: true },
  weddingDate: { type: String, required: true },
  timeZone: { type: String, required: true },
  location: {
    formattedAddress: String,
    city: String,
    state: String,
    country: String,
    latitude: Number,
    longitude: Number,
    googlePlaceId: String,
  },
  website: {
    slug: { type: String, required: true, unique: true },
    theme: { type: String, default: "CLASSIC" },
    isPublished: { type: Boolean, default: false },
    welcomeMessage: String,
  },
  gallery: {
    token: { type: String, required: true, unique: true, select: false },
    isEnabled: { type: Boolean, default: true },
    guestUploadsEnabled: { type: Boolean, default: true },
  },
  livestream: { youtubeUrl: String, isEnabled: { type: Boolean, default: false } },
  createdByUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  deletedAt: Date,
}, timestamps);

const membershipSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  weddingId: { type: Schema.Types.ObjectId, ref: "Wedding", required: true },
  role: { type: String, enum: ["ADMIN", "MANAGER"], required: true },
  joinedAt: { type: Date, required: true },
}, timestamps);
membershipSchema.index({ weddingId: 1, userId: 1 }, { unique: true });

const eventSchema = new Schema({
  weddingId: { type: Schema.Types.ObjectId, ref: "Wedding", required: true, index: true },
  name: { type: String, required: true, trim: true },
  type: { type: String, enum: ["ROKA", "ENGAGEMENT", "MEHENDI", "HALDI", "SANGEET", "COCKTAIL", "WEDDING", "RECEPTION", "CUSTOM"] },
  startsAt: { type: Date, required: true },
  endsAt: Date,
  venueName: String,
  address: String,
  description: String,
  dressCode: String,
  coverImageObjectKey: String,
  archivedAt: Date,
}, timestamps);
eventSchema.index({ weddingId: 1, startsAt: 1 });
eventSchema.index({ weddingId: 1, archivedAt: 1 });

export const User = mongoose.models.User || mongoose.model("User", userSchema);
export const Session = mongoose.models.Session || mongoose.model("Session", sessionSchema);
export const Wedding = mongoose.models.Wedding || mongoose.model("Wedding", weddingSchema);
export const WeddingMembership = mongoose.models.WeddingMembership || mongoose.model("WeddingMembership", membershipSchema);
export const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);

export type UserDocument = InferSchemaType<typeof userSchema>;
