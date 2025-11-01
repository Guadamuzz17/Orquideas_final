<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TipoPremio extends Model
{
    use HasFactory;

    protected $table = 'tb_tipo_premio';
    protected $primaryKey = 'id_tipo_premio';

    protected $fillable = [
        'nombre_premio',
        'descripcion',
        'posicion',
        'color',
        'activo',
    ];

    protected $casts = [
        'activo' => 'boolean',
        'posicion' => 'integer',
    ];

    /**
     * Scope para obtener solo premios activos
     */
    public function scopeActivos($query)
    {
        return $query->where('activo', true);
    }

    /**
     * Scope para ordenar por posición
     */
    public function scopeOrdenadosPorPosicion($query)
    {
        return $query->orderBy('posicion', 'asc');
    }
}
