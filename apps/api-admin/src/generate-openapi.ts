/* eslint-disable no-console */
import { buildSwaggerDocument } from '@ecom/nestjs-core/openapi'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as fs from 'node:fs'
import * as path from 'node:path'

async function generate() {
  process.env.GENERATE_SWAGGER = 'true'
  const app = await NestFactory.create(AppModule, { logger: false })
  app.setGlobalPrefix('admin')

  const document = buildSwaggerDocument(app, {
    title: 'E-commerce Admin API',
    description: 'The admin API for managing the e-commerce platform',
    version: '1.0.0',
    path: 'docs',
  })

  const outputPath = path.join(process.cwd(), 'openapi', 'admin.json')
  if (!fs.existsSync(path.dirname(outputPath))) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  }

  fs.writeFileSync(outputPath, JSON.stringify(document, null, 2))
  console.log(`OpenAPI schema generated at ${outputPath}`)

  try {
    await app.close()
  } catch {
    // SwaggerModule.setup binds routes that may not fully close in headless mode
  }
}

generate().catch((err) => {
  console.error('Swagger generation failed:', err)
  process.exit(1)
})
