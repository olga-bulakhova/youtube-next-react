import { VideoScreen } from '@/screen/VideoScreen'
import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Видео ...',
}

type VideoPageProps = {
	params: Promise<{ videoId: string }>
}

export default async function VideoPage({ params }: VideoPageProps) {
	const videoId = (await params).videoId
	return <VideoScreen videoId={videoId} />
}
