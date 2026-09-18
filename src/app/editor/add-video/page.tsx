import type { Metadata } from 'next'

import { AddVideoScreen } from '@/screen/AddVideoScreen'

export const metadata: Metadata = {
	title: 'Добавить видео',
}

export default function AddVideoPage() {
	return <AddVideoScreen />
}
