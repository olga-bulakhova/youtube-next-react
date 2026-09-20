import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Профиль',
}

type ProfilePageProps = {
	params: Promise<{ profileId: string }>
}

export default async function ProfilePage({ params }: ProfilePageProps) {
	const profileId = (await params).profileId
	return <div>Profile Page {profileId}</div>
}
