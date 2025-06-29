import { Router } from 'express';
import tagsController from './tag/tag.controller';
import articlesController from './article/article.controller';
import authController from './auth/auth.controller';
import profileController from './profile/profile.controller';
import testController from './test/test.controller';

const api = Router()
  .use(tagsController)
  .use(articlesController)
  .use(profileController)
  .use(authController);

if (process.env.NODE_ENV !== 'production') {
  api.use((req, res, next) => {
    const auth = req.headers.authorization;
    // const allowedIps = ['127.0.0.1', '::1', '::ffff:127.0.0.1'];

    // if (!allowedIps.includes(req.ip)) {
    //   return res.status(403).json({ error: 'Access denied: IP not allowed' });
    // }

    if (!auth || auth !== `Bearer ${process.env.TEST_UTILS_TOKEN}`) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    next();
  });

  api.use(testController);
}

export default Router().use('/api', api);
