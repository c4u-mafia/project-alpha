import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });

  // ── Swagger (NestJS app routes) ──────────────────────────────────────────
  // Auth routes (sign-up, sign-in, OTP, OAuth) live at /api/auth/reference
  // and are documented by better-auth's own openAPI() plugin.
  // This Swagger instance covers everything else — our application routes.
  const config = new DocumentBuilder()
    .setTitle('Homelyn API')
    .setDescription(
      `
Homelyn backend — Nigerian rental platform API.

**Auth routes** (sign-up, sign-in, OTP, OAuth) are documented separately by better-auth:
➜ [/api/auth/reference](/api/auth/reference)

**How to authenticate here:**
1. Sign up or sign in via the better-auth reference above.
2. Get a JWT: \`GET /api/auth/token\` (requires active session cookie from sign-in).
3. Click **Authorize** below → paste the JWT as a Bearer token.
4. All protected routes will now work.
      `.trim(),
    )
    .setVersion('0.1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT obtained from GET /api/auth/token after signing in',
      },
      'bearer',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // keeps the bearer token across page refreshes
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'Homelyn API Docs',
  });
  // ────────────────────────────────────────────────────────────────────────

  await app.listen(process.env.PORT ?? 3000);

  console.log(`\nHomelyn API running:`);
  console.log(`  App routes:  http://localhost:${process.env.PORT ?? 3000}/docs`);
  console.log(`  Auth routes: http://localhost:${process.env.PORT ?? 3000}/api/auth/reference\n`);
}

bootstrap();
