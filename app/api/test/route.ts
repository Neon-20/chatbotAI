import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const geo = req.geo
  console.log(geo)
  return NextResponse.json(geo)
}
