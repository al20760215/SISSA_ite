---
sidebar_position: 5
---

# Componentes

Componentes reutilizables utilizados en el frontend, su estructura y su propósito dentro de la aplicación.

## ¿Qué son los Componentes?

En **React**, un componente es una unidad de código independiente y reutilizable que representa una parte de la interfaz de usuario. Se pueden clasificar en:

- **Componentes Presentacionales**: Encargados de mostrar información sin lógica de negocio (botones, tarjetas, modales).
- **Componentes Contenedores**: Manejan lógica y estado de la aplicación.
- **Componentes Globales**: Utilizados en varias partes de la aplicación.

---

## Estructura de Componentes

Los componentes se encuentran dentro de la carpeta \`src/components\` y están organizados según su propósito.

```
📂 src
 ├── 📂 components   # Componentes reutilizables
 │   ├── 📂 ui       # Botones, modales, tarjetas, inputs, etc.
 │   ├── 📂 layout   # Componentes de estructura (Header, Sidebar, Footer)
 │   ├── 📂 forms    # Formularios reutilizables
 │   ├── 📂 tables   # Tablas y listas
 │   ├── 📂 charts   # Gráficos y visualización de datos
 │   ├── Button.jsx  # Ejemplo de componente de botón
 │   ├── Modal.jsx   # Ejemplo de modal reutilizable
 │   ├── Loader.jsx  # Indicador de carga
 │   └── index.js    # Exportación centralizada
```

---

## Componentes Reutilizables

### **1. Botón Reutilizable (\`Button.jsx\`)**

```jsx
import PropTypes from "prop-types";

const Button = ({ label, onClick, type = "button", className = "" }) => {
  return (
    <button
      type={type}
      className={\`px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 \${className}\`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

Button.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.string,
  className: PropTypes.string,
};

export default Button;
```

**Uso en otro componente:**
```jsx
import Button from "../components/ui/Button";

<Button label="Enviar" onClick={() => alert("Enviado")} />;
```

---

### **2. Modal Reutilizable (\`Modal.jsx\`)**

```jsx
import PropTypes from "prop-types";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg">
        <button className="absolute top-2 right-2" onClick={onClose}>✖</button>
        {children}
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default Modal;
```

**Uso en otro componente:**
```jsx
import { useState } from "react";
import Modal from "../components/ui/Modal";

const Example = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button onClick={() => setIsOpen(true)}>Abrir Modal</button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <p>Contenido del Modal</p>
      </Modal>
    </>
  );
};
```

---

### **3. Indicador de Carga (\`Loader.jsx\`)**

```jsx
const Loader = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
```

**Uso en otro componente:**
```jsx
import Loader from "../components/ui/Loader";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
  }, []);

  return <div>{loading ? <Loader /> : <p>Datos cargados</p>}</div>;
};
```

---

## Exportación Centralizada

Para facilitar la importación de componentes, creamos un archivo \`index.js\` en \`src/components/ui\`:

```js
export { default as Button } from "./Button";
export { default as Modal } from "./Modal";
export { default as Loader } from "./Loader";
```

Ahora podemos importar todos los componentes con una sola línea:

```js
import { Button, Modal, Loader } from "../components/ui";
```

---
