# PlantHealth
### API REST para la gestión de la salud vegetal

## 1. Descripción del proyecto

**PlantHealth** es una API REST desarrollada con NestJS, TypeORM y MySQL para gestionar información relacionada con la salud vegetal. El sistema permite administrar plantas, patógenos, enfermedades, susceptibilidades, tratamientos, cultivos y brotes, además de realizar consultas compuestas y obtener estadísticas.

El proyecto aplica una arquitectura modular, validaciones manuales, manejo de errores mediante excepciones HTTP y consultas a la base de datos. Para respetar los requisitos de implementación, las relaciones entre entidades se gestionan mediante identificadores y se resuelven manualmente desde los servicios, sin utilizar decoradores de relaciones de TypeORM ni uniones de tablas mediante QueryBuilder.

## 2. Integrantes

- **Isabella Cruz Quintero**
- **Juliana Velasquez Rivera**
- **Isaac Garcia Arbelaez**

### Distribución del trabajo

El proyecto se organizó en módulos funcionales para facilitar el desarrollo, la integración y el mantenimiento.

| Integrante | Responsabilidades |
|---|---|
| Isabella Cruz Quintero | Responsabilidades específicas pendientes de confirmar con la conversación original. |
| Juliana Velasquez Rivera | Participación en la documentación de los endpoints; responsabilidades adicionales pendientes de confirmar. |
| Isaac Garcia Arbelaez | Participación en la documentación de los endpoints; responsabilidades adicionales pendientes de confirmar. |

## 3. Tecnologías utilizadas

- **Node.js:** entorno de ejecución de JavaScript.
- **TypeScript:** lenguaje utilizado para implementar la API.
- **NestJS:** framework para organizar el backend mediante módulos, controladores y servicios.
- **TypeORM:** herramienta de acceso y persistencia de datos.
- **MySQL:** sistema gestor de base de datos relacional.
- **Swagger:** documentación interactiva de los endpoints.
- **Bruno:** herramienta para organizar y ejecutar solicitudes HTTP durante las pruebas.
- **Git y GitHub:** control de versiones y colaboración mediante ramas.

## 4. Funcionalidades

La API contempla los siguientes módulos:

| Módulo | Funcionalidad principal |
|---|---|
| Plantas | Gestión de los registros de plantas. |
| Patógenos | Gestión de los patógenos registrados. |
| Enfermedades | Administración de las enfermedades vegetales. |
| Susceptibilidades | Gestión de la susceptibilidad de las plantas frente a patógenos o enfermedades, según el modelo definido. |
| Tratamientos | Administración de los tratamientos registrados. |
| Cultivos | Gestión de los cultivos. |
| Brotes | Registro y administración de brotes. |
| Consultas | Consultas compuestas que reúnen información relacionada con distintos recursos. |
| Estadísticas | Obtención de estadísticas relacionadas con los datos registrados. |

Las funcionalidades transversales incluyen:

- Operaciones CRUD: crear, consultar, actualizar y eliminar registros.
- Validación manual de datos de entrada.
- Manejo apropiado de errores y excepciones HTTP.
- Comprobación de mutaciones en secuencias genéticas, de acuerdo con las reglas implementadas.
- Consultas compuestas y resolución manual de datos relacionados.
- Estadísticas sobre los registros del sistema.
- Documentación interactiva mediante Swagger.

## 5. Requisitos previos

Antes de ejecutar el proyecto, se necesita tener instalado:

- Node.js y npm.
- MySQL Server.
- Git.
- Un editor de código, como Visual Studio Code.

También se requiere acceso a la base de datos que utilizará la aplicación.

## 6. Instalación y configuración

### 6.1. Clonar el repositorio

```bash
git clone https://github.com/isabellacruzq-lgtm/PlantHealth
cd PlantHealth
```

### 6.2. Instalar dependencias

```bash
npm install
```

### 6.3. Configurar las variables de entorno

Crea un archivo `.env` en la raíz del proyecto tomando como referencia `.env.example`, si está incluido.

Completa las variables con los nombres que realmente espera la configuración de la aplicación. Por ejemplo, si el proyecto utiliza estas variables:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=tu_contrasena
DB_DATABASE=planhealth
```

Los nombres de las variables deben coincidir con los utilizados en la configuración de TypeORM del proyecto. No publiques contraseñas ni otros datos sensibles en el repositorio.

### 6.4. Crear y preparar la base de datos

1. Inicia el servidor MySQL.
2. Crea la base de datos que utilizará la aplicación.
3. Ejecuta el script SQL del proyecto, ubicado en `database/proyecto_back.sql`, si ese es el archivo presente en tu versión del repositorio.
4. Verifica que las tablas y los datos iniciales requeridos estén disponibles.
5. Confirma que las credenciales del archivo `.env` permitan conectarse a la base de datos.

## 7. Ejecución de la aplicación

### Modo desarrollo

```bash
npm run start:dev
```

### Modo normal

```bash
npm run start
```

### Compilar el proyecto

```bash
npm run build
```

La compilación permite verificar que el código TypeScript no tenga errores de compilación.

El puerto y la dirección de escucha dependen de la configuración de la aplicación.

## 8. Documentación de la API

Una vez iniciada la aplicación, la documentación interactiva de Swagger se encuentra configurada en:

```text
/api-docs
```

Si la aplicación se ejecuta localmente en el puerto 3000, la dirección será:

```text
http://localhost:3000/api-docs
```

Desde Swagger se pueden consultar los endpoints documentados, revisar los parámetros de entrada y ejecutar solicitudes cuando corresponda.

> La disponibilidad de cada endpoint depende de que el módulo correspondiente esté implementado y registrado correctamente.

## 9. Pruebas

Para compilar el proyecto:

```bash
npm run build
```

Para ejecutar las pruebas unitarias, si los scripts y las pruebas están configurados:

```bash
npm test
```

El proyecto también contempla una colección de solicitudes para Bruno, útil para probar los endpoints, verificar respuestas y comprobar el manejo de errores.

Las pruebas de integración deben ejecutarse con una base de datos configurada y accesible. La compilación exitosa, por sí sola, no garantiza que todos los endpoints funcionen correctamente en tiempo de ejecución.

## 10. Arquitectura del proyecto

El backend sigue una estructura modular basada en NestJS:

- **Módulos:** agrupan los componentes de cada funcionalidad.
- **Controladores:** reciben las solicitudes HTTP y definen los endpoints.
- **Servicios:** contienen la lógica de negocio, las validaciones y el acceso a datos.
- **Entidades:** representan las estructuras persistidas en la base de datos.
- **DTO:** definen la estructura de los datos recibidos para crear o actualizar registros.
- **Consultas y estadísticas:** agrupan funcionalidades que trabajan con información de varios recursos.

Las relaciones entre registros se manejan mediante identificadores y se resuelven desde los servicios, de acuerdo con las restricciones del proyecto.

## 11. Control de versiones y Gitflow

Para organizar el trabajo colaborativo se utiliza Git con un flujo de ramas basado en Gitflow.

Las ramas principales son:

- `main`: contiene las versiones estables del proyecto.
- `develop`: integra las funcionalidades desarrolladas.
- `feature/*`: contiene el desarrollo de funcionalidades específicas.
- `release/*`: permite preparar una versión para su entrega.

Ejemplo del flujo de trabajo:

```bash
git checkout develop
git pull origin develop
git checkout -b feature/nombre-funcionalidad

# Realizar los cambios y verificarlos
npm run build

git add -A
git commit -m "feat: describir funcionalidad"
git push -u origin feature/nombre-funcionalidad
```

Después, se crea una solicitud de integración (Pull Request) para incorporar la funcionalidad a `develop`, siguiendo las reglas acordadas por el equipo y la guía del curso.

Los cambios deben revisarse antes de integrarse. Los archivos de configuración local, las credenciales y los artefactos generados no deben incluirse en los commits.

## 12. Seguridad y buenas prácticas

- Mantener las credenciales fuera del código fuente.
- Utilizar `.env.example` como plantilla sin contraseñas reales.
- Mantener `node_modules/`, `dist/`, `.env` y los archivos de compilación fuera del control de versiones cuando corresponda.
- Validar los datos recibidos por la API.
- Devolver códigos HTTP apropiados para errores y operaciones exitosas.
- Mantener separadas las responsabilidades de controladores, servicios y entidades.
- Revisar los cambios antes de crear commits y Pull Requests.
- Documentar las modificaciones relevantes para facilitar el mantenimiento.

## 13. Estado del proyecto

PlantHealth integra módulos para la gestión de información de salud vegetal, consultas compuestas, validaciones, comprobación de mutaciones genéticas y estadísticas.

La verificación final de cada funcionalidad debe realizarse mediante la compilación, las pruebas automatizadas disponibles y las solicitudes HTTP contra una instancia configurada de la base de datos.

## 14. Licencia

Proyecto académico desarrollado con fines educativos. No se ha especificado una licencia de distribución independiente.

---

**PlantHealth — Gestión y análisis de la salud vegetal.**
# PlantHealth
### API REST de sanidad vegetal para Breaze in the Moon

## 1. Descripción del proyecto

**PlantHealth** es una API REST desarrollada con **NestJS**, **TypeORM** y **MySQL** para la compañía agrícola *Breaze in the Moon*. Centraliza la información que hoy está dispersa en cuadernos y hojas de cálculo: plantas, patógenos, enfermedades, susceptibilidades, tratamientos, cultivos y brotes reportados en campo. Además ofrece consultas compuestas, verificación de mutaciones genéticas y estadísticas de brotes.

Decisiones principales del proyecto:

- **Un módulo por recurso**, cada uno con su controlador, servicio, entidad y DTOs.
- **Validaciones manuales** en los servicios (y `ParseIntPipe` en los controladores para los IDs de ruta). Cada validación que falla responde con el código HTTP adecuado y un mensaje claro (`400`, `404`, `409`).
- **Relaciones solo por ID:** no se usan decoradores de relaciones de TypeORM (`@ManyToOne`, `@OneToMany`, etc.), ni la opción `relations`, ni `join...AndSelect`. Las relaciones se guardan como columnas con el ID y se resuelven manualmente en los servicios.
- **Documentación con Swagger** de todos los endpoints, parámetros, cuerpos y respuestas.

## 2. Integrantes

| Integrante | Responsabilidades |
|---|---|
| Isabella Cruz Quintero | Plantas, susceptibilidades y cultivos; consultas compuestas y verificación de mutaciones; colección de Bruno; integración de ramas en Gitflow. |
| Juliana Velasquez Rivera | Brotes y estadísticas. |
| Isaac Garcia Arbelaez | Patógenos, enfermedades y tratamientos. |

## 3. Tecnologías

- Node.js y TypeScript
- NestJS
- TypeORM
- MySQL
- Swagger (`@nestjs/swagger`)
- Bruno (colección de peticiones)
- Git y GitHub (Gitflow)

## 4. Requisitos previos

- Node.js 22 o superior y npm
- MySQL Server 8 o superior
- Git
- Bruno (para ejecutar la colección de peticiones)

## 5. Instalación y configuración

### 5.1. Clonar el repositorio

```bash
git clone https://github.com/isabellacruzq-lgtm/PlantHealth
cd PlantHealth
git checkout develop
```

### 5.2. Instalar dependencias

```bash
npm install
```

### 5.3. Configurar las variables de entorno

Copia el archivo de ejemplo y completa tus credenciales de MySQL:

```bash
cp .env.example .env
```

Contenido de `.env.example`:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=
DB_PASSWORD=
DB_DATABASE=proyecto_back
DB_SYNCHRONIZE=false
```

El archivo `.env` está en el `.gitignore` y no debe subirse al repositorio.

### 5.4. Crear la base de datos y cargar los datos de ejemplo

El script `database/proyecto_back.sql` crea la base de datos `proyecto_back`, todas las tablas y los datos de ejemplo para la sustentación. Ejecútalo con:

```bash
mysql -u TU_USUARIO -p < database/proyecto_back.sql
```

El script usa `INSERT IGNORE` con IDs explícitos, por lo que puede ejecutarse más de una vez sin duplicar los datos. Para empezar de cero, elimina la base de datos y vuelve a ejecutarlo.

## 6. Ejecución

```bash
# Desarrollo (con recarga automática)
npm run start:dev

# Normal
npm run start

# Compilar
npm run build
```

La API queda disponible en `http://localhost:3000` (o en el puerto definido en `PORT`).

## 7. Documentación de la API (Swagger)

Con la aplicación en ejecución, abre en el navegador:

```text
http://localhost:3000/api-docs
```

## 8. Endpoints

### Recursos (CRUD)

Cada recurso ofrece `POST /recurso`, `GET /recurso`, `GET /recurso/:id`, `PATCH /recurso/:id` y `DELETE /recurso/:id`.

| Recurso | Ruta base | Filtros del `GET` (query params) |
|---|---|---|
| Plantas | `/plantas` | `nombreComun`, `familiaBotanica`, `tipoCultivo` |
| Patógenos | `/patogenos` | `nombre`, `nombreCientifico`, `tipo`, `transmision` |
| Enfermedades | `/enfermedades` | `nombre`, `epocaRiesgo`, `patogenoId` |
| Susceptibilidades | `/susceptibilidades` | `plantaId`, `enfermedadId`, `nivel` |
| Tratamientos | `/tratamientos` | `tipo`, `enfermedadId`, `nombre` |
| Cultivos | `/cultivos` | `plantaId`, `lote`, `region`, `desde`, `hasta` |
| Brotes | `/brotes` | `plantaId`, `enfermedadId`, `region`, `desde`, `hasta` |

### Consultas compuestas y verificación de mutaciones

| Endpoint | Qué devuelve |
|---|---|
| `GET /plantas/:id/enfermedades` | Planta con sus enfermedades (según susceptibilidad), tratamientos, cultivos y brotes. |
| `GET /patogenos/:id/enfermedades` | Patógeno con las enfermedades que causa. |
| `GET /enfermedades/:id/detalle` | Enfermedad con su patógeno, tratamientos, plantas susceptibles y brotes. |
| `GET /brotes/detalle` | Brotes con su planta y su enfermedad. |
| `GET /consultas/brotes/detalle` | Brotes con planta, enfermedad y patógeno. |
| `GET /cultivos/:id/detalle` | Cultivo con su planta y la verificación genética. |
| `GET /cultivos/:id/mutaciones` | Número de mutaciones de la semilla del cultivo frente a la secuencia de referencia de su planta. Si las longitudes no coinciden responde `400` con un mensaje claro. |

### Estadísticas

| Endpoint | Qué devuelve |
|---|---|
| `GET /estadisticas/brotes-por-enfermedad` | Cantidad de brotes por enfermedad. |
| `GET /estadisticas/brotes-por-region` | Cantidad de brotes por región. |
| `GET /estadisticas/brotes-por-planta` | Cantidad de brotes por planta. |
| `GET /estadisticas/hectareas-por-enfermedad` | Hectáreas afectadas por enfermedad. |
| `GET /estadisticas/hectareas-por-region` | Hectáreas afectadas por región. |
| `GET /estadisticas/brotes-por-periodo?desde=&hasta=` | Brotes y hectáreas por mes. |
| `GET /estadisticas/patogenos-mas-problematicos` | Patógenos ordenados por brotes y hectáreas afectadas. |

## 9. Validaciones principales

| Situación | Código HTTP |
|---|---|
| Datos obligatorios ausentes o vacíos, tipos incorrectos, valores fuera de los permitidos, secuencia genética con letras distintas de A, C, G, T en mayúsculas, fechas futuras, hectáreas menores o iguales a cero, secuencias de distinta longitud al verificar mutaciones | `400 Bad Request` |
| Registro referenciado por ID que no existe (planta, enfermedad, patógeno, cultivo) | `404 Not Found` |
| Nombre científico repetido, susceptibilidad repetida para la misma planta y enfermedad, o eliminación de un registro con dependencias | `409 Conflict` |

Restricciones al eliminar:

- **Patógeno:** no se elimina si tiene enfermedades asociadas.
- **Enfermedad:** no se elimina si tiene tratamientos, susceptibilidades o brotes.
- **Planta:** no se elimina si tiene susceptibilidades, cultivos o brotes.

## 10. Pruebas y colección de Bruno

```bash
npm run build   # verifica que el código compila
npm test        # pruebas unitarias
```

La colección de Bruno está en la carpeta `bruno/`, organizada por recurso (Plantas, Patógenos, Enfermedades, Tratamientos, Susceptibilidades, Cultivos, Brotes, Consultas, Estadísticas y General). Incluye casos exitosos y casos que violan cada restricción del cliente.

Para usarla: abre Bruno, elige **Open Collection**, selecciona la carpeta `bruno/` y ejecuta las peticiones con la API corriendo y la base de datos cargada (la variable `baseUrl` apunta a `http://localhost:3000`).

## 11. Datos de ejemplo

El script SQL carga 8 plantas, 8 patógenos, 9 enfermedades, 12 tratamientos, 16 susceptibilidades, 8 cultivos y 22 brotes en distintas regiones y meses. Dos detalles útiles para la sustentación:

- Los cultivos 3, 4 y 6 tienen mutaciones (1, 1 y 2); los cultivos 1, 2, 5 y 8 no tienen ninguna.
- El cultivo 7 tiene una semilla de longitud distinta a la referencia, para mostrar el error de la verificación de mutaciones.

## 12. Control de versiones (Gitflow)

- `main`: versiones estables.
- `develop`: integración de las funcionalidades.
- `feature/*`: una rama por funcionalidad (`feature/plantas`, `feature/patogenos`, `feature/enfermedades`, `feature/tratamientos`, `feature/brotes`, `feature/consultas`, `feature/bruno`).
- `release/*` y `hotfix/*`: cuando se necesiten.

Siguiendo la indicación del curso, **las ramas no se eliminan** después de integrarlas.

Flujo de trabajo:

```bash
git checkout develop
git pull origin develop
git checkout -b feature/nombre-funcionalidad

# desarrollar, compilar y hacer commits con tu propio usuario
npm run build
git add -A
git commit -m "feat: descripción clara de lo que se hizo"
git push -u origin feature/nombre-funcionalidad
```

Después se abre un Pull Request hacia `develop`.

## 13. Licencia

Proyecto académico desarrollado con fines educativos.
