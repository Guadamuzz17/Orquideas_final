<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Participante extends Model
{
    use HasFactory;

    protected $table = 'tb_participante';
    protected $fillable = [
        'nombre',
        'numero_telefonico',
        'direccion',
        'id_tipo',
        'id_departamento',
        'id_municipio',
        'pais',
        'id_aso',
        'id_usuario',
        'id_evento'
    ];

    public function tipo()
    {
        return $this->belongsTo(TipoParticipante::class, 'id_tipo');
    }

    public function departamento()
    {
        return $this->belongsTo(Departamento::class, 'id_departamento');
    }

    public function municipio()
    {
        return $this->belongsTo(Municipio::class, 'id_municipio');
    }

    public function aso()
    {
        return $this->belongsTo(Aso::class, 'id_aso');
    }

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'id_usuario');
    }

    public function orquideas()
    {
        return $this->hasMany(Orquidea::class, 'id_participante', 'id');
    }
}
