import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import cookieParser from 'cookie-parser'
import { AppModule } from './app.module'
import { AllExceptionsFilter, ResponseInterceptor } from '@ecom/nestjs-core'
import { buildSwaggerDocument } from '@ecom/nestjs-core/openapi'
import { getCorsOrigins, getAdminPort } from '@ecom/config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix('admin')
  app.use(cookieParser())

  const document = buildSwaggerDocument(app, {
    title: 'E-commerce Admin API',
    description: 'The admin API for managing the e-commerce platform',
    version: '1.0.0',
    path: 'docs',
  })

  if (process.env.GENERATE_SWAGGER === 'true') {
    const fs = await import('node:fs')
    const path = await import('node:path')
    const outputPath = path.join(process.cwd(), 'openapi', 'admin.json')
    if (!fs.existsSync(path.dirname(outputPath))) {
      fs.mkdirSync(path.dirname(outputPath), { recursive: true })
    }
    fs.writeFileSync(outputPath, JSON.stringify(document, null, 2))
    console.log(`OpenAPI schema generated at ${outputPath}`)
    await app.close()
    process.exit(0)
  }

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

  const port = getAdminPort()
  await app.listen(port)
  console.log(`Admin API running on http://localhost:${port}`)
}

bootstrap()
