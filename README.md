# PlanHealth — Breaze in the Moon API

API REST para registrar plantas, susceptibilidades, cultivos, patógenos, enfermedades, tratamientos y brotes de sanidad vegetal. Implementada con NestJS, TypeORM y MySQL.

## Requisitos

- Node.js compatible con el proyecto y npm.
- MySQL en ejecución.

## Configuración

1. Instala dependencias: `npm install`.
2. Copia `.env.example` a `.env` y configura `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE` y `PORT`.
3. Crea la base de datos y todas las tablas ejecutando `database/schema.sql` en MySQL. Si ya tienes tablas con datos, haz una copia de seguridad y revisa sus tipos antes de volver a ejecutar el esquema.
4. Configura `DB_SYNCHRONIZE=false` cuando uses el esquema SQL. Las referencias entre tablas son IDs simples y se validan desde los servicios; no se usan relaciones automáticas de TypeORM.
5. Inicia la API: `npm run start:dev`.

> `DB_SYNCHRONIZE=true` puede servir en desarrollo, pero no se recomienda para producción. Antes de ejecutar SQL en una base con datos, revisa el esquema y haz copia de seguridad.

## Diseño y SOLID

- **Responsabilidad única (S):** los controladores solo reciben HTTP y delegan; los servicios contienen reglas de negocio; las entidades describen las columnas; los DTO describen los datos de entrada; los módulos configuran dependencias.
- **Abierto/cerrado (O):** las reglas repetibles, como la comparación genética, están aisladas en funciones comunes que se pueden probar y extender sin cambiar controladores.
- **Sustitución de Liskov (L):** no se crean jerarquías de herencia propias; por eso no hay subclases que puedan alterar el comportamiento esperado de una clase base. Si se añaden implementaciones intercambiables en el futuro, deben conservar el contrato de sus interfaces.
- **Segregación de interfaces (I):** cada controlador expone solo las operaciones del recurso o consulta que atiende; no se impone una interfaz grande a todos los servicios.
- **Inversión de dependencias (D):** NestJS inyecta repositorios de TypeORM y `DataSource`; los controladores no crean servicios ni conexiones manualmente.

Las referencias a otras entidades se consultan manualmente por ID, sin decoradores de relación ni `JOIN` de TypeORM.

## Documentación y pruebas

- Swagger: `http://localhost:3000/api-docs`
- Peticiones de ejemplo de Bruno: carpeta `bruno/PlanHealth/`
- Documentación de endpoints de Isaac: `docs/isaac-endpoints.md`
- Documentación de endpoints de Juliana: `docs/juliana-endpoints.md`
- Decisiones de diseño SOLID: `docs/arquitectura-solid.md`
- Matriz de pruebas funcionales y negativas: `docs/matriz-pruebas.md`

## Endpoints principales

- CRUD: `/plantas`, `/susceptibilidades`, `/cultivos`, `/patogenos`, `/enfermedades`, `/tratamientos`, `/brotes`.
- Consultas compuestas: `/plantas/:id/enfermedades`, `/enfermedades/:id/detalle`, `/cultivos/:id/detalle`, `/brotes/detalle`, `/patogenos/:id/enfermedades`.
- Genética: `/cultivos/:id/mutaciones`.
- Estadísticas: `/estadisticas/brotes-por-enfermedad`, `/estadisticas/brotes-por-region`, `/estadisticas/brotes-por-planta`, `/estadisticas/hectareas-por-enfermedad`, `/estadisticas/hectareas-por-region`, `/estadisticas/brotes-por-periodo`, `/estadisticas/patogenos-mas-problematicos`.

## Comandos

- `npm run build`: compila TypeScript.
- `npm run lint`: revisa estilo y problemas estáticos.
- `npm test`: ejecuta las pruebas unitarias de `src/`.
- `npm run test:e2e`: requiere una base MySQL configurada y disponible; valida el comportamiento HTTP integrado.

No se debe considerar la entrega verificada hasta ejecutar compilación, lint y pruebas en un entorno con dependencias instaladas y una base de datos disponible.
