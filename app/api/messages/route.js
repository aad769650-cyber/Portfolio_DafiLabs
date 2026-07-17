import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const body = await request.json()
    const { userId, name, email, subject, message } = body

    const saved = await prisma.contactMessage.create({
      data: { userId, name, email, subject, message },
    })

    return NextResponse.json({ success: true, data: saved })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}