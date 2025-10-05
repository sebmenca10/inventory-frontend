<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="80" />
</p>

<h1 align="center">Inventory Frontend</h1>

<p align="center">
  <strong>Aplicación web moderna para gestión de inventario</strong><br>
  React + TypeScript + Vite + Zustand + i18n + UX elegante.
</p>

---

## 🚀 Tecnologías principales

| Área | Stack |
|------|-------|
| 🖥️ Frontend | React 18 + TypeScript + Vite |
| 🗂️ Estado global | Zustand |
| 🔐 Autenticación | JWT + Rutas protegidas |
| 🌐 Internacionalización | i18next (ES/EN) |
| ⚙️ Validación de formularios | React Hook Form + Zod |
| 🧱 UI | TailwindCSS + Lucide Icons + Sonner Toasts |
| 🔍 Gráficas | Recharts |
| 🧪 Pruebas | Jest + React Testing Library *(pendiente)* |

---

## 📦 Instalación

Clona el repositorio:

```bash
git clone https://github.com/sebmenca10/inventory-frontend.git
cd inventory-frontend

npm install

npm run dev

Por defecto se inicia en:
👉 http://localhost:5173

⚙️ Variables de entorno

Crea un archivo .env en la raíz con:

VITE_API_URL=http://localhost:3000

📂 Estructura del proyecto
src/
 ├── api/               # Servicios y clientes HTTP (axios)
 ├── components/        # Componentes reutilizables
 ├── pages/             # Vistas principales (Dashboard, Products, Users, Audit)
 ├── store/             # Estado global con Zustand
 ├── routes/            # Rutas y rutas protegidas
 ├── utils/             # Utilidades (confirmToast, helpers)
 ├── i18n/              # Configuración multi-idioma
 └── main.tsx           # Punto de entrada

 🔐 Roles y accesos

 | Módulo    |    Admin    |     Operator    |      Viewer     |
| --------- | :---------: | :-------------: | :-------------: |
| Dashboard |      ✅      |        ✅        |        ✅        |
| Productos |    ✅ CRUD   | 🔍 Solo lectura | 🔍 Solo lectura |
| Usuarios  | ✅ Crear/Ver |        ❌        |        ❌        |
| Auditoría |    ✅ Ver    |        ❌        |        ❌        |

🧭 Navegación principal

/ → Dashboard

/products → Gestión de productos

/users → Administración de usuarios (solo admin)

/audit → Registros de auditoría (solo admin)

/login → Inicio de sesión

🧰 Scripts útiles

| Comando           | Descripción                                 |
| ----------------- | ------------------------------------------- |
| `npm run dev`     | Ejecuta el entorno de desarrollo            |
| `npm run build`   | Compila la app para producción              |
| `npm run preview` | Previsualiza el build local                 |
| `npm run lint`    | Ejecuta ESLint                              |
| `npm run test`    | Ejecuta las pruebas unitarias *(pendiente)* |

🌐 Backend relacionado

El frontend consume el backend desarrollado en NestJS disponible en:
👉 [inventory-backend](https://github.com/sebmenca10/inventory-backend)

👤 Autor

Sebastián Mendoza Desarrollador FullStack 💻 Proyecto Reto Técnico MR Recluta