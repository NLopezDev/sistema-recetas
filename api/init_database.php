<?php
// Script para inicializar la base de datos
require_once 'config/database.php';

echo "Inicializando base de datos del Sistema de Recetas...\n\n";

try {
    // Crear conexión sin especificar base de datos
    $pdo = new PDO(
        "mysql:host=127.0.0.1;charset=utf8",
        "root",
        "",
        array(
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        )
    );
    
    echo "✓ Conexión a MySQL establecida\n";
    
    // Crear base de datos si no existe
    $pdo->exec("CREATE DATABASE IF NOT EXISTS sistema_recetas CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    echo "✓ Base de datos 'sistema_recetas' creada/verificada\n";
    
    // Seleccionar la base de datos
    $pdo->exec("USE sistema_recetas");
    
    // Crear instancia de Database
    $database = new Database();
    $db = $database->getConnection();
    
    if (!$db) {
        throw new Exception("Error conectando a la base de datos");
    }
    
    // Crear tablas
    $result = $database->createTables();
    
    if ($result) {
        echo "✓ Tablas creadas exitosamente\n";
        
        // Verificar si ya existen usuarios
        $stmt = $db->query("SELECT COUNT(*) as count FROM users");
        $userCount = $stmt->fetch()['count'];
        
        if ($userCount == 0) {
            echo "✓ Base de datos lista para usar\n";
            echo "\nPara comenzar:\n";
            echo "1. Abre el archivo index.html en tu navegador\n";
            echo "2. Regístrate con un nuevo usuario\n";
            echo "3. Inicia sesión y comienza a agregar recetas\n";
        } else {
            echo "✓ Base de datos ya contiene " . $userCount . " usuario(s)\n";
        }
        
    } else {
        echo "✗ Error creando las tablas\n";
    }
    
} catch (PDOException $e) {
    echo "✗ Error de base de datos: " . $e->getMessage() . "\n";
    echo "\nAsegúrate de que:\n";
    echo "1. MySQL esté instalado y ejecutándose\n";
    echo "2. El usuario 'root' tenga permisos\n";
    echo "3. Las credenciales en config/database.php sean correctas\n";
} catch (Exception $e) {
    echo "✗ Error: " . $e->getMessage() . "\n";
}

echo "\n¡Inicialización completada!\n";
?>
