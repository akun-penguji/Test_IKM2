<?php

namespace App\Exceptions;

use RuntimeException;

class QuizResponseImportException extends RuntimeException
{
    public function __construct(public readonly array $rowErrors)
    {
        parent::__construct('File import SKM memiliki data yang tidak valid.');
    }
}
