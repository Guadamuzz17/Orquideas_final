<?php

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Trofeo;
use App\Models\Inscripcion;
use App\Models\Participante;
use App\Models\Orquidea;
use App\Models\User;

class ListonModuleTest extends TestCase
{
    use RefreshDatabase;

    public function test_listones_index_loads_with_auth()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/listones');
        $response->assertStatus(200);
    }

    public function test_listones_can_be_created_using_trofeos_table()
    {
        // Crear un listón usando la tabla de trofeos
        $liston = Trofeo::create([
            'tipo_premio' => 'liston',
            'tipo_liston' => 'Primer Premio',
            'descripcion' => 'Excelente presentación',
            'fecha_ganador' => now(),
            'id_inscripcion' => 1
        ]);

        $this->assertInstanceOf(Trofeo::class, $liston);
        $this->assertEquals('liston', $liston->tipo_premio);
        $this->assertEquals('Primer Premio', $liston->tipo_liston);
    }

    public function test_listones_scope_works()
    {
        // Crear un trofeo y un listón
        Trofeo::create([
            'tipo_premio' => 'trofeo',
            'categoria' => 'Primer lugar',
            'fecha_ganador' => now()
        ]);

        Trofeo::create([
            'tipo_premio' => 'liston',
            'tipo_liston' => 'Mención Honorífica',
            'fecha_ganador' => now()
        ]);

        // Verificar que el scope listones funciona
        $listones = Trofeo::listones()->get();
        $trofeos = Trofeo::trofeos()->get();

        $this->assertCount(1, $listones);
        $this->assertCount(1, $trofeos);
        $this->assertEquals('liston', $listones->first()->tipo_premio);
        $this->assertEquals('trofeo', $trofeos->first()->tipo_premio);
    }

    public function test_listones_create_page_loads()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/listones/create');
        $response->assertStatus(200);
    }
}
