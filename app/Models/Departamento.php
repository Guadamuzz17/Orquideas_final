<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Departamento extends Model
{
    use HasFactory;

    protected $table = 'tb_departamento';
    protected $primaryKey = 'id_departamento';
    protected $fillable = ['nombre_departamento'];

    public function municipios()
    {
        return $this->hasMany(Municipio::class, 'id_departamento');
    }
}