<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class GenerateTestImages extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'generate:test-images';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate test images for the photos module';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Generating test images...');

        $images = [
            'festival-2025.jpg' => [
                'title' => 'Festival de Orquídeas 2025',
                'color' => [76, 175, 80] // Verde
            ],
            'especies-raras.jpg' => [
                'title' => 'Especies Raras',
                'color' => [156, 39, 176] // Púrpura
            ],
            'concurso-foto.jpg' => [
                'title' => 'Concurso de Fotografía',
                'color' => [33, 150, 243] // Azul
            ],
            'taller-cultivo.jpg' => [
                'title' => 'Taller de Cultivo',
                'color' => [255, 152, 0] // Naranja
            ]
        ];

        foreach ($images as $filename => $data) {
            $this->createTestImage($filename, $data['title'], $data['color']);
            $this->info("Created: {$filename}");
        }

        $this->info('Test images generated successfully!');
    }

    private function createTestImage($filename, $title, $color)
    {
        $width = 400;
        $height = 300;

        // Crear una imagen
        $image = imagecreate($width, $height);

        // Definir colores
        $backgroundColor = imagecolorallocate($image, $color[0], $color[1], $color[2]);
        $textColor = imagecolorallocate($image, 255, 255, 255);
        $borderColor = imagecolorallocate($image, 200, 200, 200);

        // Llenar fondo
        imagefill($image, 0, 0, $backgroundColor);

        // Agregar borde
        imagerectangle($image, 0, 0, $width - 1, $height - 1, $borderColor);

        // Agregar texto del título
        $font_size = 3;
        $text_width = imagefontwidth($font_size) * strlen($title);
        $text_height = imagefontheight($font_size);
        $x = ($width - $text_width) / 2;
        $y = ($height - $text_height) / 2 - 20;
        imagestring($image, $font_size, $x, $y, $title, $textColor);

        // Agregar texto "Imagen de Prueba"
        $subtitle = "Imagen de Prueba";
        $subtitle_width = imagefontwidth(2) * strlen($subtitle);
        $subtitle_x = ($width - $subtitle_width) / 2;
        $subtitle_y = $y + 40;
        imagestring($image, 2, $subtitle_x, $subtitle_y, $subtitle, $textColor);

        // Agregar ícono simple de cámara
        $camera_size = 40;
        $camera_x = ($width - $camera_size) / 2;
        $camera_y = ($height - $camera_size) / 2 + 40;

        // Cuerpo de la cámara
        imagerectangle($image, $camera_x, $camera_y, $camera_x + $camera_size, $camera_y + 30, $textColor);

        // Lente
        $center_x = $camera_x + $camera_size / 2;
        $center_y = $camera_y + 15;
        imageellipse($image, $center_x, $center_y, 20, 20, $textColor);

        // Guardar la imagen
        ob_start();
        imagejpeg($image, null, 85);
        $imageData = ob_get_clean();

        Storage::disk('public')->put("fotos/{$filename}", $imageData);

        // Limpiar memoria
        imagedestroy($image);
    }
}
