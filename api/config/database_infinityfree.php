<?php
class Database {
    // Configuración para InfinityFree
    private $host = 'sql.infinityfree.com'; // Host de InfinityFree
    private $db_name = 'tu_username_sistema_recetas'; // Tu username + nombre de la DB
    private $username = 'tu_username'; // Tu username de InfinityFree
    private $password = 'tu_password_db'; // Contraseña de la base de datos
    
    public function getConnection() {
        try {
            $pdo = new PDO(
                "mysql:host={$this->host};dbname={$this->db_name};charset=utf8",
                $this->username,
                $this->password,
                array(
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false
                )
            );
            return $pdo;
        } catch (PDOException $e) {
            error_log("Error de conexión a la base de datos: " . $e->getMessage());
            return null;
        }
    }
}
?>
