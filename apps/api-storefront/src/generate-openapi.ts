import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { buildSwaggerDocument } from '@ecom/nestjs-openapi';
import * as fs from 'node:fs';
import * as path from 'node:path';

async function generate() {
  const app = await NestFactory.create(AppModule, { logger: false });

  const document = buildSwaggerDocument(app, {
    title: 'Storefront API',
    description: 'E-commerce Storefront API documentation',
    version: '1.0.0',
    path: 'api/docs',
  });

  const outputPath = path.join(process.cwd(), 'openapi', 'storefront.json');
  if (!fs.existsSync(path.dirname(outputPath))) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(document, null, 2));
  console.log(`OpenAPI schema generated at ${outputPath}`);

  await app.close();
}

generate();
