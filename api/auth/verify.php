<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Manejar preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Solo permitir POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit();
}

require_once '../config/jwt_helper.php';

try {
    // Obtener token del header
    $token = JWTHelper::getTokenFromHeader();
    
    if (!$token) {
        throw new Exception('Token no proporcionado');
    }
    
    // Verificar token
    $user_data = JWTHelper::getUserFromToken($token);
    
    if (!$user_data) {
        throw new Exception('Token inválido o expirado');
    }
    
    // Respuesta exitosa
    echo json_encode([
        'success' => true,
        'message' => 'Token válido',
        'user' => $user_data
    ]);
    
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
