<?php

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;

class GanadorBasicTest extends TestCase
{
    use RefreshDatabase;

    public function test_ganadores_routes_are_registered()
    {
        // Verificar que las rutas existen
        $routes = [
            'ganadores.index',
            'ganadores.create',
            'ganadores.store',
            'ganadores.search-inscripciones'
        ];

        foreach ($routes as $routeName) {
            $this->assertTrue(
                \Illuminate\Support\Facades\Route::has($routeName),
                "Route {$routeName} should be registered"
            );
        }
    }

    public function test_ganadores_index_redirects_without_auth()
    {
        $response = $this->get('/ganadores');
        $response->assertStatus(302); // Debe redirigir al login
    }

    public function test_ganadores_index_loads_with_auth()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/ganadores');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Ganadores/index'));
    }

    public function test_ganadores_create_loads_with_auth()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/ganadores/create');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Ganadores/Create'));
    }
}
