<?php
/**
 * Clase para envío de emails via SMTP
 * Soporta STARTTLS (puerto 587) y SSL directo (puerto 465)
 * Compatible con Gmail App Passwords
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
    private $isHtml = true;
    private $error = null;
    private $debug = [];

    public function __construct($host, $port, $username, $password, $fromEmail, $fromName) {
        $this->host = $host;
        $this->port = (int)$port;
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

    public function isHtml($flag = true) {
        $this->isHtml = $flag;
        return $this;
    }

    private function readResponse($socket) {
        $response = '';
        while ($line = fgets($socket, 1024)) {
            $response .= $line;
            // Si el 4to caracter es espacio, es la última línea de la respuesta
            if (isset($line[3]) && $line[3] === ' ') {
                break;
            }
        }
        $this->debug[] = "S: " . trim($response);
        return $response;
    }

    private function sendCommand($socket, $command) {
        $this->debug[] = "C: " . trim($command);
        fputs($socket, $command);
        return $this->readResponse($socket);
    }

    public function send() {
        try {
            if (!$this->toEmail || !$this->subject || !$this->body) {
                $this->error = 'Faltan datos: destinatario, asunto o cuerpo';
                return false;
            }

            $socket = null;

            if ($this->port === 465) {
                // Puerto 465: SSL directo
                $socket = @fsockopen("ssl://{$this->host}", $this->port, $errno, $errstr, 30);
            } else {
                // Puerto 587: conexión sin encriptar, luego STARTTLS
                $socket = @fsockopen($this->host, $this->port, $errno, $errstr, 30);
            }

            if (!$socket) {
                $this->error = "Error conectando a {$this->host}:{$this->port} - $errstr ($errno)";
                return false;
            }

            // Timeout de lectura
            stream_set_timeout($socket, 30);

            // Leer saludo del servidor
            $response = $this->readResponse($socket);
            if (strpos($response, '220') === false) {
                $this->error = "Error saludo SMTP: $response";
                fclose($socket);
                return false;
            }

            // EHLO
            $response = $this->sendCommand($socket, "EHLO localhost\r\n");
            if (strpos($response, '250') === false) {
                $this->error = "Error EHLO: $response";
                fclose($socket);
                return false;
            }

            // STARTTLS solo para puerto 587
            if ($this->port === 587) {
                $response = $this->sendCommand($socket, "STARTTLS\r\n");
                if (strpos($response, '220') === false) {
                    $this->error = "Error STARTTLS: $response";
                    fclose($socket);
                    return false;
                }

                // Activar encriptación TLS
                $crypto = stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);
                if (!$crypto) {
                    $this->error = "Error activando TLS";
                    fclose($socket);
                    return false;
                }

                // EHLO de nuevo después de TLS
                $response = $this->sendCommand($socket, "EHLO localhost\r\n");
                if (strpos($response, '250') === false) {
                    $this->error = "Error EHLO post-TLS: $response";
                    fclose($socket);
                    return false;
                }
            }

            // AUTH LOGIN
            $response = $this->sendCommand($socket, "AUTH LOGIN\r\n");
            if (strpos($response, '334') === false) {
                $this->error = "Error AUTH LOGIN: $response";
                fclose($socket);
                return false;
            }

            // Username
            $response = $this->sendCommand($socket, base64_encode($this->username) . "\r\n");
            if (strpos($response, '334') === false) {
                $this->error = "Error username: $response";
                fclose($socket);
                return false;
            }

            // Password
            $response = $this->sendCommand($socket, base64_encode($this->password) . "\r\n");
            if (strpos($response, '235') === false) {
                $this->error = "Error autenticación: $response";
                fclose($socket);
                return false;
            }

            // MAIL FROM
            $response = $this->sendCommand($socket, "MAIL FROM: <{$this->fromEmail}>\r\n");
            if (strpos($response, '250') === false) {
                $this->error = "Error MAIL FROM: $response";
                fclose($socket);
                return false;
            }

            // RCPT TO
            $response = $this->sendCommand($socket, "RCPT TO: <{$this->toEmail}>\r\n");
            if (strpos($response, '250') === false) {
                $this->error = "Error RCPT TO: $response";
                fclose($socket);
                return false;
            }

            // DATA
            $response = $this->sendCommand($socket, "DATA\r\n");
            if (strpos($response, '354') === false) {
                $this->error = "Error DATA: $response";
                fclose($socket);
                return false;
            }

            // Construir mensaje
            $message = "From: =?UTF-8?B?" . base64_encode($this->fromName) . "?= <{$this->fromEmail}>\r\n";
            $message .= "To: <{$this->toEmail}>\r\n";
            $message .= "Subject: =?UTF-8?B?" . base64_encode($this->subject) . "?=\r\n";
            $message .= "Date: " . date('r') . "\r\n";
            $message .= "MIME-Version: 1.0\r\n";
            $message .= "Content-Type: " . ($this->isHtml ? "text/html" : "text/plain") . "; charset=UTF-8\r\n";
            $message .= "Content-Transfer-Encoding: base64\r\n";
            $message .= "\r\n";
            $message .= chunk_split(base64_encode($this->body));

            // Enviar mensaje
            $response = $this->sendCommand($socket, $message . "\r\n.\r\n");
            if (strpos($response, '250') === false) {
                $this->error = "Error enviando mensaje: $response";
                fclose($socket);
                return false;
            }

            // QUIT
            $this->sendCommand($socket, "QUIT\r\n");
            fclose($socket);

            return true;

        } catch (Exception $e) {
            $this->error = $e->getMessage();
            if ($socket && is_resource($socket)) {
                fclose($socket);
            }
            return false;
        }
    }

    public function getError() {
        return $this->error;
    }

    public function getDebug() {
        return implode("\n", $this->debug);
    }
}
?>
