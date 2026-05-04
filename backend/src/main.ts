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

---

**How to get a token and authenticate:**

\`\`\`
Step 1 — Open /api/auth/reference
Step 2 — Sign up (POST /sign-up/email) or sign in (POST /sign-in/email)
Step 3 — Call GET /api/auth/token  ← returns { token: "eyJ..." }
Step 4 — Click Authorize (padlock icon) → paste the token → Authorize
\`\`\`

All routes marked with a padlock will now work with your token.
The token is valid for **7 days**. Repeat step 2–4 when it expires.

---

**Mobile (Expo/React Native):**
The \`@better-auth/expo\` client plugin stores the session token automatically in SecureStore.
It sends \`Authorization: Bearer <token>\` on every request — no manual setup needed.
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
