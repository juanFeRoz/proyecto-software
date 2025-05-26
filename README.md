# ProGit

Entrega del proyecto final de ingenieria de software

## Como correr el Frontend
### Requisitos:

- Node.js


Primero se tiene que revisar si se tiene instalado Node.js:
```
node -v 
npm -v
```
Si obtienes un error, instala Node.js desde [Nodejs.org](https://nodejs.org/) (elige la versión LTS).
Ahora instala Angular CLI
```
npm install -g @angular/cli
```
Ahora verifica la correcta instalación con:
```
ng version
```

**Desde el root del proyecto:**

```
cd frontend && ng serve
```

## Como correr el Backend

### Requisitos:

- Java 24

**Desde el root del proyecto:**

```
cd backend && ./mvnw spring-boot:run
```
