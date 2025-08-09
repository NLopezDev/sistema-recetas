<?php
// Utilidades para JWT (JSON Web Tokens)
class JWTHelper {
    private static $secret_key = 'tu_jwt_secret_super_seguro_y_muy_largo_para_maxima_seguridad_2024';
    private static $algorithm = 'HS256';
    private static $expiration_time = 86400; // 24 horas en segundos
    
    // Generar JWT
    public static function generateToken($user_data) {
        $header = json_encode(['typ' => 'JWT', 'alg' => self::$algorithm]);
        $payload = json_encode([
            'user_id' => $user_data['id'],
            'email' => $user_data['email'],
            'name' => $user_data['name'],
            'iat' => time(),
            'exp' => time() + self::$expiration_time,
            'jti' => bin2hex(random_bytes(32)) // JWT ID único
        ]);
        
        $base64_header = self::base64url_encode($header);
        $base64_payload = self::base64url_encode($payload);
        
        $signature = hash_hmac('sha256', $base64_header . "." . $base64_payload, self::$secret_key, true);
        $base64_signature = self::base64url_encode($signature);
        
        return $base64_header . "." . $base64_payload . "." . $base64_signature;
    }
    
    // Verificar JWT
    public static function verifyToken($token) {
        $parts = explode('.', $token);
        
        if (count($parts) !== 3) {
            return false;
        }
        
        $header = $parts[0];
        $payload = $parts[1];
        $signature = $parts[2];
        
        // Verificar firma
        $expected_signature = hash_hmac('sha256', $header . "." . $payload, self::$secret_key, true);
        $expected_signature = self::base64url_encode($expected_signature);
        
        if (!hash_equals($signature, $expected_signature)) {
            return false;
        }
        
        // Decodificar payload
        $payload_data = json_decode(self::base64url_decode($payload), true);
        
        if (!$payload_data) {
            return false;
        }
        
        // Verificar expiración
        if (isset($payload_data['exp']) && $payload_data['exp'] < time()) {
            return false;
        }
        
        return $payload_data;
    }
    
    // Obtener usuario del token
    public static function getUserFromToken($token) {
        $payload = self::verifyToken($token);
        
        if (!$payload) {
            return null;
        }
        
        return [
            'id' => $payload['user_id'],
            'email' => $payload['email'],
            'name' => $payload['name']
        ];
    }
    
    // Codificación base64url
    private static function base64url_encode($data) {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }
    
    // Decodificación base64url
    private static function base64url_decode($data) {
        return base64_decode(strtr($data, '-_', '+/') . str_repeat('=', 3 - (3 + strlen($data)) % 4));
    }
    
    // Obtener token del header Authorization
    public static function getTokenFromHeader() {
        $headers = getallheaders();
        
        if (isset($headers['Authorization'])) {
            $auth_header = $headers['Authorization'];
            if (preg_match('/Bearer\s+(.*)$/i', $auth_header, $matches)) {
                return $matches[1];
            }
        }
        
        return null;
    }
}
?>
