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
        'tiene_trofeo',
        'fecha_ganador',
        'tipo_premio',
        'tipo_liston',
        'descripcion',
        'id_inscripcion',
        'id_evento',
        'id_tipo_premio'
    ];

    protected $casts = [
        'fecha_ganador' => 'date',
        'tiene_trofeo' => 'boolean'
    ];

    // Scopes para filtrar por tipo
    public function scopeTrofeos($query)
    {
        return $query->where('tipo_premio', 'trofeo');
    }

    public function scopeListones($query)
    {
        return $query->where('tipo_premio', 'liston');
    }

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

    public function inscripcion()
    {
        return $this->belongsTo(Inscripcion::class, 'id_inscripcion', 'id_nscr');
    }

    public function tipoPremio()
    {
        return $this->belongsTo(TipoPremio::class, 'id_tipo_premio', 'id_tipo_premio');
    }

    // Accessors para datos de inscripción (para listones)
    public function getParticipanteAttribute()
    {
        return $this->inscripcion?->participante;
    }

    public function getOrquideaInscripcionAttribute()
    {
        return $this->inscripcion?->orquidea;
    }

    public function getCorrelativoAttribute()
    {
        return $this->inscripcion?->correlativo;
    }
}
