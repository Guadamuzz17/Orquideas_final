<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Orquidea extends Model
{
    use HasFactory;

    protected $table = 'tb_orquidea';
    protected $primaryKey = 'id_orquidea';
    protected $fillable = [
        'nombre_planta',
        'origen',
        'foto',
        'id_grupo',
        'id_case'
    ];

    public function grupo()
    {
        return $this->belongsTo(Grupo::class, 'id_grupo', 'id_grupo');
    }

    public function clase()
    {
        return $this->belongsTo(Clase::class, 'id_case', 'id_clase');
    }

}