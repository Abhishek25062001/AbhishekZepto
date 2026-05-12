import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';

import { env } from '../../config/env';
import { openApiDocument } from '../../docs/openapi';

const router = Router();

router.get('/openapi.json', (request, response) => {
  void request;
  response.json(openApiDocument);
});

router.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));

export const shouldExposeApiDocs = env.APP_ENV !== 'production';

export default router;
