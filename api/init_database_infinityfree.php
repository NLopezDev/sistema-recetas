<?php
// Script de inicialización para InfinityFree
require_once 'config/database_infinityfree.php';

try {
    $database = new Database();
    $pdo = $database->getConnection();
    
    if (!$pdo) {
        die("Error: No se pudo conectar a la base de datos");
    }
    
    echo "<h2>Inicializando Base de Datos en InfinityFree</h2>";
    
    // Crear tabla users
    $sql_users = "CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )";
    
    $pdo->exec($sql_users);
    echo "✅ Tabla 'users' creada exitosamente<br>";
    
    // Crear tabla recipes
    $sql_recipes = "CREATE TABLE IF NOT EXISTS recipes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        ingredients TEXT NOT NULL,
        instructions TEXT NOT NULL,
        category ENUM('cocina', 'pasteleria') NOT NULL,
        prep_time INT NOT NULL,
        difficulty ENUM('facil', 'medio', 'dificil') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )";
    
    $pdo->exec($sql_recipes);
    echo "✅ Tabla 'recipes' creada exitosamente<br>";
    
    // Crear usuario de prueba
    $check_user = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $check_user->execute(['test@example.com']);
    
    if (!$check_user->fetch()) {
        $hashed_password = password_hash('password123', PASSWORD_DEFAULT);
        $insert_user = $pdo->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
        $insert_user->execute(['Test User', 'test@example.com', $hashed_password]);
        echo "✅ Usuario de prueba creado exitosamente<br>";
    } else {
        echo "ℹ️ Usuario de prueba ya existe<br>";
    }
    
    echo "<br><strong>🎉 Base de datos inicializada correctamente!</strong><br>";
    echo "<br><strong>Credenciales de prueba:</strong><br>";
    echo "Email: test@example.com<br>";
    echo "Contraseña: password123<br>";
    
} catch (PDOException $e) {
    echo "<h3>❌ Error:</h3>";
    echo "<p>" . $e->getMessage() . "</p>";
    echo "<h3>🔧 Solución:</h3>";
    echo "<p>1. Verifica que la base de datos existe en InfinityFree</p>";
    echo "<p>2. Confirma los datos de conexión en database_infinityfree.php</p>";
    echo "<p>3. Asegúrate de que el usuario tiene permisos en la base de datos</p>";
}
?>
