<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Almacenada extends Model
{
    use HasFactory;

    protected $table = 'tb_almacenadas';
    protected $fillable = [
        'id_orquidea',
        'estado',
        'motivo'
    ];

    public function orquidea()
    {
        return $this->belongsTo(Orquidea::class, 'id_orquidea');
    }
}