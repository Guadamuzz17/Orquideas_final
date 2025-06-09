<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ganador extends Model
{
    use HasFactory;

    protected $table = 'tb_ganadores';
    protected $primaryKey = 'id_ganador';
    protected $fillable = [
        'id_proudsa',
        'id_grupo',
        'id_case',
        'posicion',
        'empate',
        'fecha_ganador'
    ];

    public function participante()
    {
        return $this->belongsTo(Participante::class, 'id_proudsa');
    }

    public function grupo()
    {
        return $this->belongsTo(Grupo::class, 'id_grupo');
    }

    public function clase()
    {
        return $this->belongsTo(Clase::class, 'id_case');
    }
}