import { Router } from 'express';
import { resetDatabase, seedDatabase } from './test.service';

const router = Router();

router.post('/test-utils/reset-db', async (_req, res) => {
  try {
    await resetDatabase();
    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(500).json({ ok: false, error: (error as Error).message });
  }
});

router.post('/test-utils/seed-db', async (_req, res) => {
  try {
    await seedDatabase();
    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(500).json({ ok: false, error: (error as Error).message });
  }
});

export default router;
