# 🍳 Sistema de Recetas - Cocina y Pastelería

Un sistema web completo para gestionar y compartir recetas de cocina y pastelería, desarrollado con PHP, MySQL, HTML, CSS y JavaScript.

## ✨ Características

- 🔐 **Sistema de Autenticación**: Registro e inicio de sesión seguro con JWT
- 📱 **Diseño Responsive**: Optimizado para desktop, tablet y móvil
- 🍰 **Gestión de Recetas**: Crear, editar, eliminar y visualizar recetas
- 📂 **Categorización**: Organizar recetas por Cocina y Pastelería
- 🎨 **Interfaz Moderna**: Diseño elegante y amigable
- ⚡ **Rendimiento Optimizado**: Carga rápida y experiencia fluida

## 🛠️ Tecnologías Utilizadas

- **Backend**: PHP 8.2+
- **Base de Datos**: MySQL
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Autenticación**: JWT (JSON Web Tokens)
- **Servidor**: Apache (XAMPP)
- **Iconos**: Font Awesome 6

## 📋 Requisitos Previos

- XAMPP (Apache + MySQL + PHP)
- PHP 8.0 o superior
- MySQL 5.7 o superior
- Navegador web moderno

## 🚀 Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/sistema-recetas.git
cd sistema-recetas
```

### 2. Configurar XAMPP
1. Inicia XAMPP
2. Activa Apache y MySQL
3. Coloca el proyecto en `htdocs/`

### 3. Configurar la base de datos
1. Abre phpMyAdmin: `http://localhost/phpmyadmin`
2. Ejecuta el script de inicialización:
```bash
php api/init_database.php
```

### 4. Configurar la conexión
Edita `api/config/database.php` si es necesario:
```php
private $host = '127.0.0.1';
private $db_name = 'sistema_recetas';
private $username = 'root';
private $password = '';
```

### 5. Acceder al sistema
Abre tu navegador y ve a: `http://localhost/sistema-recetas/`

## 🎮 Demo Online

Para probar el sistema sin instalación, puedes usar la versión demo:

### **Demo Estático (Sin Backend)**
- **Archivo**: `demo.html`
- **Funcionalidades**: Login demo, ver recetas, agregar recetas (temporales)
- **Credenciales**: `demo@example.com` / `demo123`
- **Limitaciones**: Los datos se pierden al recargar la página

### **Demo en GitHub Pages**
Si quieres hacer el demo accesible online, puedes:
1. Renombrar `demo.html` a `index.html` en una rama separada
2. Configurar GitHub Pages en esa rama
3. El demo funcionará sin necesidad de servidor PHP

## 👤 Usuario de Prueba

- **Email**: `test@example.com`
- **Contraseña**: `password123`

## 📁 Estructura del Proyecto

```
sistema-recetas/
├── api/
│   ├── auth/
│   │   ├── login.php
│   │   ├── register.php
│   │   └── verify.php
│   ├── config/
│   │   ├── database.php
│   │   └── jwt_helper.php
│   ├── recipes/
│   │   ├── create_recipe.php
│   │   ├── delete_recipe.php
│   │   ├── get_recipes.php
│   │   └── update_recipe.php
│   └── init_database.php
├── css/
│   └── style.css
├── js/
│   └── app.js
├── index.html
├── .htaccess
├── .gitignore
└── README.md
```

## 🔧 Configuración

### Variables de Entorno
El proyecto usa configuración directa en `api/config/database.php`. Para producción, considera usar variables de entorno.

### Base de Datos
- **Nombre**: `sistema_recetas`
- **Tablas**: `users`, `recipes`
- **Charset**: UTF-8

## 🎨 Características del Diseño

- **Paleta de Colores**: Azules y grises elegantes
- **Tipografía**: Segoe UI, Tahoma, Geneva, Verdana
- **Efectos**: Gradientes, sombras, transiciones suaves
- **Responsive**: Breakpoints en 768px y 480px

## 🔐 Seguridad

- **Contraseñas**: Hash con `password_hash()` y `password_verify()`
- **Autenticación**: JWT tokens
- **Validación**: Frontend y backend
- **Sanitización**: Inputs validados y escapados

## 📱 Responsive Design

- **Desktop**: Ancho máximo 900px
- **Tablet**: 95% del viewport
- **Móvil**: 98% del viewport
- **Touch-friendly**: Botones y inputs optimizados

## 🚀 Despliegue

### Local (Desarrollo)
1. XAMPP para desarrollo local
2. Puerto 80 (Apache)
3. Puerto 3306 (MySQL)

### Producción
1. Servidor web con PHP 8.0+
2. Base de datos MySQL
3. Configurar variables de entorno
4. SSL recomendado

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Tu Nombre**
- GitHub: [@tu-usuario](https://github.com/tu-usuario)

## 🙏 Agradecimientos

- Font Awesome por los iconos
- XAMPP por el entorno de desarrollo
- Comunidad PHP por las mejores prácticas

---

⭐ Si te gusta este proyecto, dale una estrella en GitHub!
