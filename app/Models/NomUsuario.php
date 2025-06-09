<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NomUsuario extends Model
{
    use HasFactory;

    protected $table = 'nom_usuarios';
    protected $primaryKey = 'Id_usuario';
    protected $fillable = [
        'nombre_usuario',
        'tipo_usuario'
    ];
}