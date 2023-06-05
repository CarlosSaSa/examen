# Back-End
## Tecnologia usada: NodeJSM, TypeScript, Express

## Requerimientos
NodeJS v18.x.x
NPM v9.5.x

Asegurarse de que la contraseña de la base de datos sea la correcta.
Para ejecutar el proyecto primero hay que instalar las dependecias y ejecutar el servidor
```sh
npm install
npm run dev
```
Para hacer el build de producción ejecutar lo siguiente:
```sh
npm run build
```
La aplicación corre sobre el puerto 5000
Para hacer el deploy de la aplicación sobre un ambiente Linux se necesita un manejador de procesos en segundo plano, en esto
caso se recomienda hacer uso de PM2 despues hacer un proxy inverso con NGINX o Apache
