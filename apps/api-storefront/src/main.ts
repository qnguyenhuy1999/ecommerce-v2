import { NestFactory } from '@nestjs/core'
import { Logger, ValidationPipe } from '@nestjs/common'
import cookieParser from 'cookie-parser'
import { ensureWorkspaceEnvFileLoaded } from '@ecom/config'
import { AppModule } from './app.module'
import { AllExceptionsFilter, ResponseInterceptor } from '@ecom/nestjs-core'
import { buildSwaggerDocument } from '@ecom/nestjs-core/openapi'
import { getCorsOrigins, getStorefrontPort } from '@ecom/config'

async function bootstrap() {
  ensureWorkspaceEnvFileLoaded()

  const app = await NestFactory.create(AppModule)
  const logger = new Logger('Bootstrap')

  app.use(cookieParser())

  app.enableCors({
    origin: getCorsOrigins(),
    credentials: true,
  })

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  app.useGlobalFilters(new AllExceptionsFilter())
  app.useGlobalInterceptors(new ResponseInterceptor())

  const document = buildSwaggerDocument(app, {
    title: 'Storefront API',
    description: 'E-commerce Storefront API documentation',
    version: '1.0.0',
    path: 'api/docs',
  })

  if (process.env.GENERATE_SWAGGER === 'true') {
    const fs = await import('node:fs')
    const path = await import('node:path')
    const outputPath = path.join(process.cwd(), 'openapi', 'storefront.json')
    if (!fs.existsSync(path.dirname(outputPath))) {
      fs.mkdirSync(path.dirname(outputPath), { recursive: true })
    }
    fs.writeFileSync(outputPath, JSON.stringify(document, null, 2))
    logger.log(`OpenAPI schema generated at ${outputPath}`)
    await app.close()
    process.exit(0)
  }

  const port = getStorefrontPort()
  await app.listen(port)
  logger.log(`API running on http://localhost:${port}`)
}

void bootstrap()
