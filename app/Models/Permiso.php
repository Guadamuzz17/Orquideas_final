<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Permiso extends Model
{
    protected $table = 'permisos';

    protected $fillable = [
        'nombre',
        'modulo',
        'descripcion',
        'ruta',
    ];

    /**
     * Relación con roles
     */
    public function roles()
    {
        return $this->belongsToMany(Rol::class, 'roles_permisos', 'permiso_id', 'rol_id')
            ->withTimestamps();
    }
}
