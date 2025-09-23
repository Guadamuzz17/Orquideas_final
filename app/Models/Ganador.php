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
        'id_inscripcion',
        'posicion',
        'empate',
        'fecha_ganador'
    ];

    protected $casts = [
        'empate' => 'boolean',
        'fecha_ganador' => 'datetime'
    ];

    // Relación con inscripción (que contiene orquídea, participante y correlativo)
    public function inscripcion()
    {
        return $this->belongsTo(Inscripcion::class, 'id_inscripcion', 'id_nscr');
    }

    // Accessor para obtener datos de la inscripción fácilmente
    public function getParticipanteAttribute()
    {
        return $this->inscripcion?->participante;
    }

    public function getOrquideaAttribute()
    {
        return $this->inscripcion?->orquidea;
    }

    public function getCorrelativoAttribute()
    {
        return $this->inscripcion?->correlativo;
    }

    public function getGrupoAttribute()
    {
        return $this->inscripcion?->orquidea?->grupo;
    }

    public function getClaseAttribute()
    {
        return $this->inscripcion?->orquidea?->clase;
    }
}