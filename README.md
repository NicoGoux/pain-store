# Backend de Pain Store

Este es el backend para el eCommerce **PAIN STORE**. A continuación se mencionan los pasos para llevar a cabo la inicialización del proyecto.

## Comenzando

Sigue estas instrucciones para obtener una copia del proyecto.

### Instalación

1. Clona este repositorio en tu computadora.

2. Ve al directorio del proyecto.

3. Instala las dependencias.

4. Configura tus variables de entorno creando un archivo `.env` en la carpeta raíz del proyecto. las variables que deben ser consideradas son:

    - MONGODB_URI: URI de conexion a la base de datos mongodb

    - JWT_SEC: JWT secreto utilizado para los tokens de inicio de sesión

    - JWT_SEC_RECOVERY: JWT secreto utilizado para la recuperación.

    - JWT_SEC_CONFIRM_EMAIL: JWT secreto utilizado para la validación de email.

    - EMAIL_USER: Dirección de email que se utilizara para realizar el envío de email dentro del servidor.

    - EMAIL_APP_PASS: Contraseña de la dirección de email

5. Inicia el servidor mediante el comando `npm run dev`.

El servidor se pondrá en funcionamiento por defecto en http://localhost:3030. Si desea modificar el puerto, puede agregar al archivo `.env` la variable de entorno PORT

## Uso

El backend proporciona una API REST que te permite realizar las siguientes acciones:

- Administrar usuarios.
- Administrar productos.
- Administrar pedidos de compra.
- Administrar los métodos de pago.

Puedes encontrar más detalles en la documentación de la API. Para acceder, una vez inicializado el servidor ingrese a la dirección http://localhost:3030/api-docs

## Autor

- Nicolás Goux

## Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para obtener más detalles.
>>>>>>> a667604f7d8f75b16584544ddadf065d3b496dd3
