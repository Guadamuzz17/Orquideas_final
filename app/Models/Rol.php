<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rol extends Model
{
    protected $table = 'roles';

    protected $fillable = [
        'nombre',
        'descripcion',
        'activo',
    ];

    protected $casts = [
        'activo' => 'boolean',
    ];

    /**
     * Relación con permisos
     */
    public function permisos()
    {
        return $this->belongsToMany(Permiso::class, 'roles_permisos', 'rol_id', 'permiso_id')
            ->withTimestamps();
    }

    /**
     * Relación con usuarios
     */
    public function usuarios()
    {
        return $this->hasMany(User::class, 'rol_id');
    }

    /**
     * Scope para roles activos
     */
    public function scopeActivos($query)
    {
        return $query->where('activo', true);
    }

    /**
     * Verificar si el rol tiene un permiso específico
     */
    public function tienePermiso($permiso)
    {
        if (is_string($permiso)) {
            return $this->permisos->contains('nombre', $permiso);
        }

        return $this->permisos->contains('id', $permiso);
    }
}
