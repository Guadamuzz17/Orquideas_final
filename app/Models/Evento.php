<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Evento extends Model
{
    protected $table = 'tb_evento';
    protected $primaryKey = 'id_evento';

    protected $fillable = [
        'nombre_evento',
        'descripcion',
        'fecha_inicio',
        'fecha_fin',
        'estado',
    ];

    protected $casts = [
        'fecha_inicio' => 'date',
        'fecha_fin' => 'date',
    ];

    // Relaciones
    public function participantes(): HasMany
    {
        return $this->hasMany(Participante::class, 'id_evento', 'id_evento');
    }

    public function orquideas(): HasMany
    {
        return $this->hasMany(Orquidea::class, 'id_evento', 'id_evento');
    }

    public function inscripciones(): HasMany
    {
        return $this->hasMany(Inscripcion::class, 'id_evento', 'id_evento');
    }

    public function ganadores(): HasMany
    {
        return $this->hasMany(Ganador::class, 'id_evento', 'id_evento');
    }

    public function fotos(): HasMany
    {
        return $this->hasMany(FotoEvento::class, 'id_evento', 'id_evento');
    }

    // Scopes
    public function scopeActivos($query)
    {
        return $query->where('estado', 'en curso');
    }

    public function scopeFinalizados($query)
    {
        return $query->where('estado', 'finalizado');
    }

    public function scopeProgramados($query)
    {
        return $query->where('estado', 'programado');
    }
}

