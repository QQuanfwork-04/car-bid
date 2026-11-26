import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

// Adds `.openapi()` to zod schemas. Every module imports `z` from here
// so the extension is guaranteed to be applied before schemas are built.
extendZodWithOpenApi(z);

export { z };
