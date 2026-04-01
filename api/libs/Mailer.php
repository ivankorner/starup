<?php
/**
 * Clase simplificada para envío de emails via SMTP
 * Compatible con Gmail usando verificación TLS
 */

class Mailer {
    private $host;
    private $port;
    private $username;
    private $password;
    private $fromEmail;
    private $fromName;
    private $toEmail;
    private $toName;
    private $subject;
    private $body;
    private $altBody;
    private $isHtml = true;
    private $error = null;

    public function __construct($host, $port, $username, $password, $fromEmail, $fromName) {
        $this->host = $host;
        $this->port = $port;
        $this->username = $username;
        $this->password = $password;
        $this->fromEmail = $fromEmail;
        $this->fromName = $fromName;
    }

    public function addAddress($email, $name = '') {
        $this->toEmail = $email;
        $this->toName = $name ?: $email;
        return $this;
    }

    public function subject($subject) {
        $this->subject = $subject;
        return $this;
    }

    public function body($body) {
        $this->body = $body;
        return $this;
    }

    public function altBody($text) {
        $this->altBody = $text;
        return $this;
    }

    public function isHtml($flag = true) {
        $this->isHtml = $flag;
        return $this;
    }

    public function send() {
        try {
            // Validaciones básicas
            if (!$this->toEmail) {
                $this->error = 'Email destinatario no configurado';
                return false;
            }

            if (!$this->subject) {
                $this->error = 'Asunto no configurado';
                return false;
            }

            if (!$this->body && !$this->altBody) {
                $this->error = 'Cuerpo del mensaje no configurado';
                return false;
            }

            // Abrir conexión SMTP
            $socket = fsockopen("tls://{$this->host}", $this->port, $errno, $errstr, 30);

            if (!$socket) {
                $this->error = "Error conectando SMTP: $errstr ($errno)";
                return false;
            }

            // Leer respuesta inicial del servidor
            $response = fgets($socket, 1024);
            if (strpos($response, '220') === false) {
                $this->error = "Error SMTP inicial: $response";
                fclose($socket);
                return false;
            }

            // EHLO
            fputs($socket, "EHLO {$this->host}\r\n");
            $response = fgets($socket, 1024);

            // AUTH LOGIN
            fputs($socket, "AUTH LOGIN\r\n");
            $response = fgets($socket, 1024);

            if (strpos($response, '334') === false) {
                $this->error = "Error AUTH: $response";
                fclose($socket);
                return false;
            }

            // Username (base64)
            fputs($socket, base64_encode($this->username) . "\r\n");
            $response = fgets($socket, 1024);

            // Password (base64)
            fputs($socket, base64_encode($this->password) . "\r\n");
            $response = fgets($socket, 1024);

            if (strpos($response, '235') === false) {
                $this->error = "Error autenticación SMTP: $response";
                fclose($socket);
                return false;
            }

            // MAIL FROM
            fputs($socket, "MAIL FROM: <{$this->fromEmail}>\r\n");
            fgets($socket, 1024);

            // RCPT TO
            fputs($socket, "RCPT TO: <{$this->toEmail}>\r\n");
            fgets($socket, 1024);

            // DATA
            fputs($socket, "DATA\r\n");
            fgets($socket, 1024);

            // Construir headers
            $headers = "From: {$this->fromName} <{$this->fromEmail}>\r\n";
            $headers .= "To: {$this->toName} <{$this->toEmail}>\r\n";
            $headers .= "Subject: {$this->subject}\r\n";
            $headers .= "Date: " . date('r') . "\r\n";
            $headers .= "MIME-Version: 1.0\r\n";

            if ($this->isHtml) {
                $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
                $headers .= "Content-Transfer-Encoding: 7bit\r\n";
            } else {
                $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
            }

            $message = $headers . "\r\n" . $this->body;

            // Enviar mensaje
            fputs($socket, $message . "\r\n.\r\n");
            $response = fgets($socket, 1024);

            if (strpos($response, '250') === false) {
                $this->error = "Error enviando mensaje: $response";
                fclose($socket);
                return false;
            }

            // QUIT
            fputs($socket, "QUIT\r\n");
            fclose($socket);

            return true;

        } catch (Exception $e) {
            $this->error = $e->getMessage();
            return false;
        }
    }

    public function getError() {
        return $this->error;
    }
}
?>
