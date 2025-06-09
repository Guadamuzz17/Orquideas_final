<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Clase extends Model
{
    use HasFactory;

    protected $table = 'tb_clase';
    protected $primaryKey = 'id_clase';
    protected $fillable = [
        'nombre_clase',
        'id_grupp'
    ];

    public function grupo()
    {
        return $this->belongsTo(Grupo::class, 'id_grupp', 'id_grupo');
    }
}