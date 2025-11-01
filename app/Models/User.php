<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'rol_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Relación con el rol
     */
    public function rol()
    {
        return $this->belongsTo(Rol::class, 'rol_id');
    }

    /**
     * Verificar si el usuario tiene un permiso específico
     */
    public function tienePermiso($permiso)
    {
        if (!$this->rol) {
            return false;
        }

        return $this->rol->tienePermiso($permiso);
    }

    /**
     * Verificar si el usuario tiene alguno de los permisos
     */
    public function tieneAlgunPermiso(array $permisos)
    {
        foreach ($permisos as $permiso) {
            if ($this->tienePermiso($permiso)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Verificar si el usuario es admin general
     */
    public function esAdminGeneral()
    {
        return $this->rol && $this->rol->nombre === 'Admin General';
    }

    /**
     * Verificar si el usuario es digitador
     */
    public function esDigitador()
    {
        return $this->rol && $this->rol->nombre === 'Digitador';
    }
}
