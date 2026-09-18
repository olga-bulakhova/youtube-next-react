import { apiSuccess } from '../../_utils';
import { db } from '../../_utils/storage';

export const dynamic = 'force-dynamic';

export async function GET() {
  const activeCategories = db.getActiveCategories();

  return apiSuccess({ categories: activeCategories });
}
