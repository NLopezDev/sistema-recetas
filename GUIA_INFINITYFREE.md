# 🚀 Guía Completa: Subir Proyecto a InfinityFree

## 📋 Requisitos Previos

- Cuenta en InfinityFree (gratuita)
- Archivos del proyecto listos
- Paciencia (puede tomar 10-15 minutos)

## 🎯 Paso a Paso

### **1. Crear Cuenta en InfinityFree**

1. **Ve a**: https://infinityfree.net/
2. **Haz clic en "Sign Up"**
3. **Completa el registro**:
   - Email válido
   - Contraseña segura
   - Verifica tu email

### **2. Crear Sitio Web**

1. **Inicia sesión** en tu cuenta
2. **Ve a "Control Panel"**
3. **Haz clic en "Create Account"**
4. **Configura tu sitio**:
   ```
   Domain: tusitio.infinityfreeapp.com
   Username: tu_username
   Password: tu_password
   Email: tu_email
   ```

### **3. Esperar Activación**

- **Tiempo**: 5-15 minutos
- **Verifica**: Ve a "Control Panel" → Tu sitio web
- **Listo**: Cuando aparezca "Active"

### **4. Configurar Base de Datos**

1. **Ve a "MySQL Databases"**
2. **Crea nueva base de datos**:
   ```
   Database Name: sistema_recetas
   Username: tu_username
   Password: tu_password_db
   ```
3. **Anota los datos** de conexión

### **5. Subir Archivos**

#### **Opción A: File Manager (Recomendado)**

1. **Ve a "File Manager"**
2. **Navega a `htdocs`** o `public_html`
3. **Sube todos los archivos**:
   - Selecciona todos los archivos del proyecto
   - Arrastra y suelta
   - Espera a que termine la subida

#### **Opción B: FTP**

1. **Obtén credenciales FTP**:
   ```
   Host: ftpupload.net
   Usuario: tu_username
   Contraseña: tu_password
   Puerto: 21
   ```
2. **Usa FileZilla** o similar
3. **Sube a la carpeta `htdocs`**

### **6. Configurar Base de Datos**

1. **Edita** `api/config/database_infinityfree.php`
2. **Actualiza los datos**:
   ```php
   private $host = 'sql.infinityfree.com';
   private $db_name = 'tu_username_sistema_recetas';
   private $username = 'tu_username';
   private $password = 'tu_password_db';
   ```

### **7. Inicializar Base de Datos**

1. **Ve a tu sitio**: `http://tusitio.infinityfreeapp.com/`
2. **Ejecuta**: `http://tusitio.infinityfreeapp.com/api/init_database_infinityfree.php`
3. **Verifica** que aparezcan los mensajes de éxito

### **8. Probar el Sistema**

1. **Ve a tu sitio**: `http://tusitio.infinityfreeapp.com/`
2. **Usa las credenciales**:
   - Email: `test@example.com`
   - Contraseña: `password123`

## 🔧 Solución de Problemas

### **Error de Conexión a Base de Datos**

1. **Verifica** que la base de datos existe
2. **Confirma** los datos en `database_infinityfree.php`
3. **Espera** 10-15 minutos después de crear la DB

### **Error 500**

1. **Revisa** los logs de error
2. **Verifica** que PHP esté habilitado
3. **Confirma** que los archivos se subieron correctamente

### **Archivos No Se Ven**

1. **Verifica** que estén en `htdocs`
2. **Confirma** permisos de archivos
3. **Espera** 5-10 minutos para propagación

## 📁 Estructura de Archivos en InfinityFree

```
htdocs/
├── api/
│   ├── auth/
│   ├── config/
│   │   ├── database_infinityfree.php  ← IMPORTANTE
│   │   └── jwt_helper.php
│   ├── recipes/
│   └── init_database_infinityfree.php ← IMPORTANTE
├── css/
├── js/
├── index.html
└── .htaccess
```

## ⚠️ Limitaciones de InfinityFree

- **Ancho de banda**: Limitado
- **Almacenamiento**: 5GB
- **Base de datos**: 1GB
- **Tiempo de inactividad**: 15 minutos
- **CPU**: Limitado

## 🎉 ¡Listo!

Tu proyecto estará disponible en:
**http://tusitio.infinityfreeapp.com/**

## 📞 Soporte

- **Foro InfinityFree**: https://forum.infinityfree.net/
- **Documentación**: https://infinityfree.net/support/
- **Estado del servicio**: https://status.infinityfree.net/

---

**¡Disfruta tu proyecto en línea! 🚀**
