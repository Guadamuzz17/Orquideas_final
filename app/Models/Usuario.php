<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Crypt;

class Usuario extends Model
{
    use HasFactory;

    protected $table = 'tb_usuarios';
    protected $primaryKey = 'id_usuario';
    protected $fillable = [
        'nombre_usuario',
        'correo',
        'contrasena',
        'id_departamento',
        'id_municipio',
        'id_tipo_usu',
        'id_aso'
    ];

    // Accesores para descifrar los campos encriptados
    public function getNombreUsuarioAttribute($value)
    {
        return Crypt::decrypt($value);
    }

    public function getCorreoAttribute($value)
    {
        return Crypt::decrypt($value);
    }

    public function getContrasenaAttribute($value)
    {
        return Crypt::decrypt($value);
    }

    // Mutadores para cifrar los campos
    public function setNombreUsuarioAttribute($value)
    {
        $this->attributes['nombre_usuario'] = Crypt::encrypt($value);
    }

    public function setCorreoAttribute($value)
    {
        $this->attributes['correo'] = Crypt::encrypt($value);
    }

    public function setContrasenaAttribute($value)
    {
        $this->attributes['contrasena'] = Crypt::encrypt($value);
    }

    // Relaciones
    public function departamento()
    {
        return $this->belongsTo(Departamento::class, 'id_departamento');
    }

    public function municipio()
    {
        return $this->belongsTo(Municipio::class, 'id_municipio');
    }

    public function tipoUsuario()
    {
        return $this->belongsTo(NomUsuario::class, 'id_tipo_usu', 'Id_usuario');
    }

    public function aso()
    {
        return $this->belongsTo(Aso::class, 'id_aso');
    }
}