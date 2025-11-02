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
        'id_clase',
        'cantidad',
        'id_participante',
=======
        'id_participante'
>>>>>>> ffa8e2b26f7287a7dd579ad1ec8c84fb46b6e3a3
    ];

    public function grupo()
    {
        return $this->belongsTo(Grupo::class, 'id_grupo', 'id_grupo');
    }

    public function clase()
    {
        return $this->belongsTo(Clase::class, 'id_clase', 'id_clase');
<<<<<<< HEAD
    }

    public function participante()
    {
        return $this->belongsTo(Participante::class, 'id_participante');
=======
>>>>>>> ffa8e2b26f7287a7dd579ad1ec8c84fb46b6e3a3
    }

    public function participante()
    {
        return $this->belongsTo(Participante::class, 'id_participante', 'id');
    }

    public function inscripciones()
    {
        return $this->hasMany(Inscripcion::class, 'id_orquidea', 'id_orquidea');
    }

    /**
     * Get the URL for the orchid photo
     */
    public function getImageUrlAttribute()
    {
        if ($this->foto) {
            return asset('storage/' . $this->foto);
        }
        return null;
    }

    /**
     * Get the full photo URL
     */
    public function getPhotoUrlAttribute()
    {
        return $this->getImageUrlAttribute();
    }

}
