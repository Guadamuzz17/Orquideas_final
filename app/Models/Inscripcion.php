<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inscripcion extends Model
{
    use HasFactory;

    protected $table = 'tb_inscripcion';
    protected $primaryKey = 'id_nscr';
    public $incrementing = true;
    protected $keyType = 'int';
    
    protected $fillable = [
        'id_participante',
        'id_orquidea',
        'correlativo'
    ];

    // Accessor para que el modelo también responda a 'id'
    public function getIdAttribute()
    {
        return $this->id_nscr;
    }

    public function participante()
    {
        return $this->belongsTo(Participante::class, 'id_participante');
    }

    public function orquidea()
    {
        return $this->belongsTo(Orquidea::class, 'id_orquidea', 'id_orquidea');
    }

    public function ganador()
    {
        return $this->hasOne(Ganador::class, 'id_inscripcion', 'id_nscr');
    }
}