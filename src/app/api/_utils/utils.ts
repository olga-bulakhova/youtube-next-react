import { NextResponse } from 'next/server'

export function apiSuccess<T>(data: T, status = 200) {
	return NextResponse.json({ ok: true as const, ...data }, { status })
}

export function apiError(message: string, status = 400) {
	return NextResponse.json({ ok: false as const, error: message }, { status })
}
