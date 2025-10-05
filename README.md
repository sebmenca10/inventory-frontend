# Inventory Frontend


## Scripts
- `npm run dev` – entorno local
- `npm run build` – build producción
- `npm run preview` – previsualizar build
- `npm test` – ejecutar unit tests (Jest)


## Variables de entorno
Copiar `.env.example` → `.env` y ajustar `VITE_API_BASE_URL`.


## Despliegue en AWS
- Build → `npm run build` → carpeta `dist/`
- Subir `dist/` a **S3** con hosting estático
- Poner **CloudFront** delante (incluir fallback a `/index.html` para SPA)