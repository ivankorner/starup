<?php
namespace PHPMailer\PHPMailer;

class Exception extends \Exception
{
    /**
     * Prettify error message output
     *
     * @return string
     */
    public function errorMessage()
    {
        $errorMsg = '<strong>' . htmlspecialchars($this->getMessage()) . "</strong><br />\n";
        return $errorMsg;
    }
}
