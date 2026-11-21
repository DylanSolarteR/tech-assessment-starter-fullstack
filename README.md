# Cuentas contables

Aplicación con una API de NestJS, un frontend de React con Vite y PostgreSQL 17. La API usa Prisma 7 para listar y crear cuentas contables con una jerarquía y un catálogo de naturalezas.

## Requisitos

- Node.js 22, según `.nvmrc`; con nvm puedes ejecutar `nvm use`.
- npm 10 o superior. Comprueba las versiones con `node -v` y `npm -v`.
- Docker con Docker Compose y el motor de Docker iniciado.
- Puertos locales disponibles: `5432` para PostgreSQL, `3000` para la API y `5173` para el frontend.

Todos los comandos siguientes se ejecutan desde la raíz del repositorio o del worktree en el que estés trabajando.

## Primera ejecución

### 1. Configurar `api/.env`

Copia el archivo de ejemplo antes de iniciar la API. En PowerShell:

```powershell
Copy-Item api/.env.example api/.env
```

En Bash puedes usar `cp api/.env.example api/.env`. Si ya existe `api/.env`, revisa su contenido sin sobrescribir tu configuración.

Para la base de datos definida en [`docker-compose.yml`](./docker-compose.yml), `api/.env` debe contener:

```dotenv
DATABASE_URL="postgresql://app_user:app_password@localhost:5432/app_starter_fullstack?schema=public"
PORT=3000
WEB_ORIGIN="http://localhost:5173"
```

La conexión corresponde a estos valores de Docker Compose:

| Dato | Valor |
| --- | --- |
| Usuario (`POSTGRES_USER`) | `app_user` |
| Contraseña local (`POSTGRES_PASSWORD`) | `app_password` |
| Base de datos (`POSTGRES_DB`) | `app_starter_fullstack` |
| Host y puerto publicados | `localhost:5432` |
| Schema de PostgreSQL | `public` |

Se usa `localhost` porque la API corre en tu equipo; Docker ejecuta únicamente PostgreSQL. `db` es el nombre del servicio dentro de la red de Docker. `api/.env` es un archivo local ignorado por Git: no publiques credenciales reales.

### 2. Iniciar PostgreSQL

```bash
docker compose up -d db
docker compose ps
```

Espera a que `db` aparezca como `healthy`. El volumen `postgres_data` conserva los datos entre reinicios.

### 3. Instalar dependencias y crear las tablas

```bash
npm install
npm run prisma:migrate --prefix api -- --name init
```

La instalación de la raíz instala también las dependencias de `api/` y `web/`, y genera Prisma Client. La migración crea las tablas `Cuenta` y `Naturaleza` en la base configurada en `DATABASE_URL`.

### 4. Cargar los datos iniciales

```bash
npm run prisma:seed --prefix api
```

El seed carga las naturalezas **Débito** y **Crédito**, y estas ocho cuentas:

```text
1 Activo [Débito]
└── 11 Disponible
    └── 1105 Caja
        ├── 110505 Caja general
        └── 110510 Caja menor
2 Pasivo [Crédito]
└── 21 Obligaciones financieras
    └── 2105 Bancos nacionales
```

Las cuentas descendientes conservan la naturaleza de su rama. Los IDs son autoincrementales; los códigos contables son valores únicos independientes del ID.

El seed ejecuta ambas tablas en una transacción y puede repetirse sin duplicar estos datos: reutiliza las naturalezas por nombre y actualiza las cuentas por código, incluyendo nombre, naturaleza, padre y estado activo. Prisma 7 requiere ejecutar el seed explícitamente; las migraciones no lo ejecutan automáticamente.

### 5. Iniciar la aplicación

```bash
npm run dev
```

| Servicio | Dirección |
| --- | --- |
| Frontend | [http://localhost:5173](http://localhost:5173) |
| API | [http://localhost:3000](http://localhost:3000) |
| Cuentas | [http://localhost:3000/cuentas](http://localhost:3000/cuentas) |

El frontend usa `http://localhost:3000` por defecto. Para cambiarlo, copia `web/.env.example` a `web/.env` y ajusta `VITE_API_URL`. Si cambias el origen del frontend, actualiza también `WEB_ORIGIN` en `api/.env` y reinicia los procesos.

En siguientes ejecuciones basta con iniciar PostgreSQL y ejecutar `npm run dev`. Aplica las nuevas migraciones cuando cambie el schema.

## Estructura y acceso a datos

```text
api/
  prisma/             Schema y scripts de seed
  prisma.config.ts    Configuración de la CLI de Prisma
  src/database/       DatabaseModule y PrismaService
  src/cuentas/        Módulo, controller, service y DTOs de cuentas
  src/naturalezas/    Módulo, controller y service de uso interno
  src/generated/      Cliente generado; no se versiona
  test/               Pruebas HTTP
web/src/              Frontend React
docs/diagrams/        Modelo entidad-relación
```

La integración sigue la [documentación de NestJS para Prisma](https://docs.nestjs.com/recipes/prisma). `DatabaseModule` exporta `PrismaService`, que conecta al iniciar la API y cierra la conexión al terminar. Por ello PostgreSQL y `DATABASE_URL` deben estar disponibles para arrancar NestJS.

`Cuenta` tiene código único, nombre de hasta 100 caracteres, una naturaleza obligatoria y un padre opcional. `Naturaleza` tiene ID y nombre. Prisma usa campos camelCase y `@map` conserva los nombres de las columnas del diagrama.

## Endpoints

La API expone únicamente estas operaciones de cuentas:

| Método | Ruta | Función |
| --- | --- | --- |
| `GET` | `/cuentas` | Obtener el listado general |
| `POST` | `/cuentas` | Crear una cuenta |

Ejemplo de cuerpo JSON para crear una cuenta; reemplaza `naturalezaId` por un ID existente del catálogo. Puedes consultar los IDs con Prisma Studio:

```json
{
  "codigo": 110515,
  "nombre": "Caja auxiliar",
  "naturalezaId": 1,
  "cuentaPadreId": null,
  "active": true
}
```

`cuentaPadreId: null` representa una cuenta raíz. Para asociarla a un padre, usa su **ID**, no su código contable. El módulo de naturalezas ofrece un service para uso interno y no publica endpoints; su catálogo inicial se carga mediante el seed.

La API valida los datos de entrada y comprueba que la naturaleza y la cuenta padre existan. Los datos inválidos y las referencias inexistentes devuelven `400`; los códigos duplicados devuelven `409`.

## Comandos de desarrollo

| Comando desde la raíz | Función |
| --- | --- |
| `npm run dev` | API y frontend con recarga |
| `npm run dev:api` / `npm run dev:web` | Iniciar un solo servicio |
| `npm run build` | Compilar ambas aplicaciones |
| `npm run lint` | Revisar ambas aplicaciones con oxlint |
| `npm test` | Ejecutar pruebas unitarias de la API |
| `npm run test:e2e --prefix api` | Ejecutar pruebas HTTP de la API |
| `npm run test:cov --prefix api` | Obtener cobertura de la API |
| `npm run prisma:validate --prefix api` | Validar el schema |
| `npm run prisma:generate --prefix api` | Regenerar Prisma Client |
| `npm run prisma:migrate --prefix api -- --name <cambio>` | Crear y aplicar una migración local |
| `npm run prisma:seed --prefix api` | Cargar los datos iniciales |
| `npm run prisma:studio --prefix api` | Explorar la base de datos |

Después de modificar `api/prisma/schema.prisma`, crea la migración y regenera el cliente. La compilación también regenera Prisma Client. Las pruebas usan Vitest y Supertest; los dobles de Prisma permiten comprobar la API sin una base de datos activa. No sustituyen una prueba contra PostgreSQL real.

## Problemas habituales

- **La API no inicia:** verifica que `api/.env` exista, tenga `DATABASE_URL` y que `docker compose ps` muestre PostgreSQL disponible.
- **Faltan tablas:** ejecuta la migración antes del seed o de usar los endpoints.
- **Error de autenticación en PostgreSQL:** comprueba los valores del `.env`. Un volumen existente conserva las credenciales con las que se inicializó, aunque después cambies Docker Compose.
- **El frontend no conecta:** revisa `VITE_API_URL`, el puerto de la API y `WEB_ORIGIN`.
- **Para detener PostgreSQL:** usa `docker compose stop db`; conserva el volumen y sus datos.
