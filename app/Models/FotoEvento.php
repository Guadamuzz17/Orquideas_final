<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class FotoEvento extends Model
{
    use HasFactory;

    protected $table = 'fotos_eventos';

    protected $fillable = [
        'titulo',
        'descripcion',
        'fecha_evento',
        'ruta_imagen',
        'id_evento'
    ];

    protected $casts = [
        'fecha_evento' => 'date',
    ];

    // Asegurarnos de que el accessor url_imagen se incluya en la serialización
    protected $appends = ['url_imagen'];

    /**
     * Get the full URL for the image
     */
    public function getUrlImagenAttribute()
    {
        // Verificar si el archivo existe
        $imagePath = 'fotos/' . basename($this->ruta_imagen);

        if (Storage::disk('public')->exists($imagePath)) {
            return asset('storage/' . $imagePath);
        }

        // Si no existe, devolver imagen placeholder local
        return asset('images/placeholder-image.svg');
    }

    /**
     * Get the image path for storage operations
     */
    public function getImagenPathAttribute()
    {
        return storage_path('app/public/fotos/' . basename($this->ruta_imagen));
    }

    /**
     * Delete the image file when the model is deleted
     */
    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($fotoEvento) {
            if ($fotoEvento->ruta_imagen && Storage::disk('public')->exists('fotos/' . basename($fotoEvento->ruta_imagen))) {
                Storage::disk('public')->delete('fotos/' . basename($fotoEvento->ruta_imagen));
            }
        });
    }
}
