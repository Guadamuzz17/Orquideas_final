<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Trofeo extends Model
{
    use HasFactory;

    protected $table = 'tb_trofeo';
    protected $primaryKey = 'id_trofeo';
    protected $fillable = [
        'id_orquidea',
        'id_clase',
        'id_grupp',
        'categoria',
        'fecha_ganador'
    ];

    public function orquidea()
    {
        return $this->belongsTo(Orquidea::class, 'id_orquidea');
    }

    public function clase()
    {
        return $this->belongsTo(Clase::class, 'id_clase');
    }

    public function grupo()
    {
        return $this->belongsTo(Grupo::class, 'id_grupp');
    }
}