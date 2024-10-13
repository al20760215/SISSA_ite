import React, { Component } from "react"; // Importamos React y Component de la biblioteca de React
import { useLocation, NavLink } from "react-router-dom"; // Importamos useLocation y NavLink de react-router-dom para manejar la navegación

import { Nav } from "react-bootstrap"; // Importamos el componente Nav de react-bootstrap para la navegación

import logo from "assets/img/itelogo.png"; // Importamos el logo desde la ruta especificada

// Define el componente funcional Sidebar
function Sidebar({ color, image, routes }) {
  const location = useLocation(); // Obtiene la ubicación actual de la ruta usando useLocation de react-router-dom
  const activeRoute = (routeName) => {
    // Función para determinar si la ruta actual es la activa
    return location.pathname.indexOf(routeName) > -1 ? "active" : ""; // Devuelve "active" si la ruta actual contiene routeName, de lo contrario devuelve una cadena vacía
  };

  return (
    <div className="sidebar" data-image={image} data-color={color}> {/* Contenedor principal del sidebar con propiedades de imagen y color */}
      <div
        className="sidebar-background"
        style={{
          backgroundImage: "url(" + image + ")" // Establece la imagen de fondo del sidebar usando la propiedad image
        }}
      />
      <div className="sidebar-wrapper"> {/* Contenedor del contenido del sidebar */}
        <div className="logo d-flex align-items-center justify-content-start"> {/* Contenedor del logo con clases de flexbox para alineación */}
          <a
            href="https://www.creative-tim.com?ref=lbd-sidebar"
            className="simple-text logo-mini mx-1"
          >
            <div className="logo-img">
              <img src={require("assets/img/itelogo.png")} alt="..." /> {/* Imagen del logo Importamosda */}
            </div>
          </a>
          <a className="simple-text" href="http://localhost:3000/admin/dashboard">
            SISSA {/* Texto del logo */}
          </a>
        </div>
        <Nav> {/* Contenedor de la navegación */}
          {routes.map((prop, key) => {
            // Mapea cada ruta en el array routes
            if (!prop.redirect)
              return (
                <li
                  className={
                    prop.upgrade
                      ? "active active-pro"
                      : activeRoute(prop.layout + prop.path) // Establece la clase activa si la ruta coincide
                  }
                  key={key} // Asigna una clave única para cada elemento de la lista
                >
                  <NavLink
                    to={prop.layout + prop.path} // Establece la ruta de navegación
                    className="nav-link"
                    activeClassName="active" // Clase activa para el enlace de navegación
                  >
                    <i className={prop.icon} /> {/* Icono de la ruta */}
                    <p>{prop.name}</p> {/* Nombre de la ruta */}
                  </NavLink>
                </li>
              );
            return null; // No renderiza nada si prop.redirect es verdadero
          })}
        </Nav>
      </div>
    </div>
  );
}

export default Sidebar; // Exporta el componente Sidebar para su uso en otros archivos
