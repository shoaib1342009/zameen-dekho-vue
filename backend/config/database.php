<?php
class Database {
    private $host = 'localhost'; // Hostinger default
    private $db_name = 'zameen_dekho_db'; // Change this to your database name
    private $username = 'your_username'; // Change this to your username
    private $password = 'your_password'; // Change this to your password
    public $conn;

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name,
                $this->username,
                $this->password
            );
            $this->conn->exec("set names utf8");
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
        }
        return $this->conn;
    }
}
?>