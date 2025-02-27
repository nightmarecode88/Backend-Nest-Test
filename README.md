# Proyecto de Backend con NestJS, Firebase y Swagger

## Descripción
Este proyecto es una API RESTful construida con NestJS para manejar usuarios y películas. Los datos se almacenan en una base de datos de Firestore de Google. La API está documentada con Swagger y se puede acceder a la documentación [aquí](https://backend-nest-test-w6iu.vercel.app/api).
- Hace uso de la api de Star Wars https://swapi.dev/api , la creación-edición-eliminación y actualización con SWAPI la hacen los usuarios administradores (rol=1).
- Los usuarios regulares (rol=0) solo pueden editar-eliminar su cuenta, tambien ver el listado de peliculas y el detalle de las mismas.
- [Postman file](./Api%20nest%20backend%20by%20NinghtmareCode88.postman_collection.json)


### Base de Datos
- **Firestore** de Google
- **Colecciones**: `usuarios` y `peliculas`
- **Usuario Inicial**: `admin` (contraseña: `admin`, rol: `administrador`)

## Requisitos
- Node.js
- NestJS CLI
- Cuenta de Firebase
- Vercel CLI (para despliegue)

## Instalación
1. Clona el repositorio:
    ```bash
    git clone https://github.com/tu-usuario/tu-repo.git
    cd tu-repo
    ```

2. Instala las dependencias:
    ```bash
    npm install
    ```

3. Configura Firebase:
    - Crea un proyecto en [Firebase](https://firebase.google.com/)
    - Descarga el archivo de configuración `firebaseConfig.json` y colócalo en la raíz del proyecto.

4. Configura las variables de entorno:
    ```bash
    cp .env.example .env
    ```
    - Edita el archivo `.env` con las variables de entorno necesarias.

## Uso
1. Inicia el servidor:
    ```bash
    npm run start
    ```

2. Accede a la documentación de Swagger:
    [https://backend-nest-test-w6iu.vercel.app/api](https://backend-nest-test-w6iu.vercel.app/api)

## Flujo de Uso

### Paso 1:
El usuario externo creará un usuario regular con estos datos: `[nombre, email, password]`.
- **URL**: [https://backend-nest-test-w6iu.vercel.app/usuariosRegulares/new_user](https://backend-nest-test-w6iu.vercel.app/usuariosRegulares/new_user)
- **JSON en body (raw)**:
    ```json
    {
      "nombre": "Username",
      "email": "user123@email.com",
      "password": "abc123"
    }
    ```

### Paso 2:
El usuario regular hará un login para obtener el token Bearer.
- **URL**: [https://backend-nest-test-w6iu.vercel.app/usuariosRegulares/login_user](https://backend-nest-test-w6iu.vercel.app/usuariosRegulares/login_user)
- **JSON en body**:
    ```json
    {
      "nombre": "Username",
      "password": "abc123"
    }
    ```

De respuesta, se devuelve un JSON con el parámetro `token`.
- **Respuesta**:
    ```json
    {
      "token": "token"
    }
    ```

### Autorización:
Ese token debe usarse como Authorization Bearer Token en los demás endpoints (Esta configurado con expiración a los 30min)

### Roles de Usuarios:
- **Rol 2**: admin (super administrador)
- **Rol 1**: administradores (solo el usuario `admin` puede crear usuarios administradores)
- **Rol 0**: usuarios regulares

## Seguridad
Se usa **JWT** para realizar los tokens y garantizar la seguridad de las interacciones.



## Contacto
- Autor: NightmareCode88
- Email: nightmare.code.88@gmail.com

