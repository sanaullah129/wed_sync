import { NextResponse } from "next/server";

export function dataResponse<T>(data: T, status = 200) {
  return NextResponse.json({ data }, { status });
}

export function successResponse(status = 200) {
  return NextResponse.json({ success: true }, { status });
}
