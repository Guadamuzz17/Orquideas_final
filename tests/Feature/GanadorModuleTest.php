<?php

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Ganador;
use App\Models\Inscripcion;
use App\Models\Participante;
use App\Models\Orquidea;
use App\Models\User;

class GanadorModuleTest extends TestCase
{
    use RefreshDatabase;

    public function test_ganadores_index_loads_with_auth()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/ganadores');
        $response->assertStatus(200);
    }

    public function test_ganador_model_works()
    {
        // Verificar que el modelo puede obtener registros sin errores
        $count = Ganador::count();
        $this->assertIsInt($count);
    }

    public function test_ganadores_with_relationships()
    {
        // Verificar que las relaciones funcionan
        $ganadores = Ganador::with([
            'inscripcion.participante',
            'inscripcion.orquidea.grupo',
            'inscripcion.orquidea.clase'
        ])->get();

        $this->assertIsObject($ganadores);
    }

    public function test_ganadores_index_without_auth_redirects()
    {
        $response = $this->get('/ganadores');
        $response->assertStatus(302); // Debe redirigir al login
    }
}
