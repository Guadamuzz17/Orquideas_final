<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inscripcion extends Model
{
    use HasFactory;

    protected $table = 'tb_inscripcion';
    protected $primaryKey = 'id_nscr';
    protected $fillable = [
        'id_participante',
        'id_orgudea',
        'correlativo'
    ];

    public function participante()
    {
        return $this->belongsTo(Participante::class, 'id_participante');
    }

    public function orquidea()
    {
        return $this->belongsTo(Orquidea::class, 'id_orgudea');
    }
}