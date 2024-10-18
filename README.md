# SISSA
## Sistema Integral de Servicio Social Albatros

Desarrollo Local de SISSA, seguir las siguientes acciones para levantar la pagina:

1.- Instalar NodeJS LTS \\borrar->(https://nodejs.org/dist/v20.18.0/node-v20.18.0-x64.msi)

   1.1 Instalar fnm (Fast Node Manager)
    Windows.- 
      winget install Schniz.fnm
    MACoS & Linux.- 
      curl -fsSL https://fnm.vercel.app/install | bash
  1.2 Configurar fnm &activarlo
    windows.-
      fnm env --use-on-cd | Out-String | Invoke-Expression
    MACoS & Linux.- 
      source ~/.bashrc
  1.3 Verificacion de version de Node.js
    node -v # should print `v20.18.0`
  1.4 Verificacion de version correcta de npm
  npm -v # should print `10.8.2`

2.- Abrir el terminal desde la carpeta del proyecto e ingresar el siguiente comando: npm install

3.- Una vez termine la instalacion, ingresamos el siguiente comando: npm start

4.- Se debe de abir automaticamente la pagina, pero si no se abre, podemos ingresar la siguiente direccion https://localhost:3000



*Nota: La visualicacion de este proyecto es preliminar y en texto, aun no hay funciones ni comunicacion con la BD.
