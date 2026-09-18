import type { Metadata } from 'next'

type CategoryPageProps = {
	params: Promise<{ categoryId: string }>
}

export const metadata: Metadata = {
	title: 'Видео категории',
}

export default async function CategoryPage({ params }: CategoryPageProps) {
	const categoryId = (await params).categoryId

	console.log(categoryId)

	return <div>Category Page {categoryId}</div>
}
