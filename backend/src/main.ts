import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { OpenAPIObject } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { auth } from './auth';

function scalarPage(specUrl: string, title: string): string {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
  </head>
  <body>
    <script
      id="api-reference"
      data-url="${specUrl}"
      data-configuration='{"authentication":{"preferredSecurityScheme":"bearer"}}'
    ></script>
    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
  </body>
</html>`;
}

const AUTH_SKIP_PATHS = new Set(['/ok', '/error', '/callback/{id}', '/delete-user/callback']);

async function buildFullDocument(nestDocument: OpenAPIObject): Promise<OpenAPIObject> {
  let authDoc: Record<string, any> | null = null;
  try {
    authDoc = (await (auth.api as any).generateOpenAPISchema()) as Record<string, any>;
  } catch {
    return nestDocument;
  }

  if (!authDoc || typeof authDoc.paths !== 'object') {
    return nestDocument;
  }

  const nest = nestDocument as any;
  const port = process.env.PORT ?? 3000;

  // Prefix auth paths with /api/auth so they resolve correctly against the
  // merged server (http://localhost:PORT) instead of the auth-only server.
  const prefixedPaths: Record<string, unknown> = {};
  for (const [path, pathItem] of Object.entries(authDoc.paths)) {
    if (AUTH_SKIP_PATHS.has(path)) continue;
    const prefixedItem: Record<string, unknown> = {};
    for (const [method, operation] of Object.entries(pathItem as Record<string, any>)) {
      prefixedItem[method] = {
        ...operation,
        tags: ((operation as any).tags ?? []).map((t: string) => (t === 'Default' ? 'Auth' : t)),
      };
    }
    prefixedPaths[`/api/auth${path}`] = prefixedItem;
  }

  const authTags = ((authDoc.tags ?? []) as Array<{ name: string; description?: string }>).map(
    (t) => (t.name === 'Default' ? { ...t, name: 'Auth' } : t),
  );

  return {
    ...nestDocument,
    servers: [{ url: `http://localhost:${port}` }],
    paths: { ...prefixedPaths, ...(nest.paths ?? {}) },
    components: {
      ...nest.components,
      schemas: {
        ...(authDoc.components?.schemas ?? {}),
        ...(nest.components?.schemas ?? {}),
      },
      securitySchemes: {
        ...(authDoc.components?.securitySchemes ?? {}),
        ...(nest.components?.securitySchemes ?? {}),
      },
    },
    tags: [...authTags, ...(nest.tags ?? [])],
  } as OpenAPIObject;
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false,
  });

  const config = new DocumentBuilder()
    .setTitle('Homelyn API')
    .setDescription(
      [
        'Nigerian rental platform — all routes in one place.',
        '',
        '**How to authenticate:**',
        '1. `POST /api/auth/sign-up/email` — create account',
        '2. `POST /api/auth/email-otp/verify-email` — verify OTP from terminal/email',
        '3. `GET /api/auth/token` — copy the `token` value',
        '4. Click **Authorize** (top-right) → paste token → Authorize',
        '',
        'Token valid for **7 days**.',
      ].join('\n'),
    )
    .setVersion('0.1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT from GET /api/auth/token — valid 7 days',
      },
      'bearer',
    )
    .build();

  const nestDocument = SwaggerModule.createDocument(app, config);
  const fullDocument = await buildFullDocument(nestDocument);

  app.use((req: any, res: any, next: any) => {
    if (req.method !== 'GET') return next();
    if (req.path === '/docs-json') return res.json(fullDocument);
    if (req.path === '/docs') {
      res.setHeader('Content-Type', 'text/html');
      return res.send(scalarPage('/docs-json', 'Homelyn API'));
    }
    next();
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`\nHomelyn API`);
  console.log(`  Unified docs  →  http://localhost:${port}/docs`);
  console.log(`  Auth-only UI  →  http://localhost:${port}/api/auth/reference`);
  console.log(`  Raw JSON spec →  http://localhost:${port}/docs-json\n`);
}

bootstrap();
