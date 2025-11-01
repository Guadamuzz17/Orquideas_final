<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Requests\UserRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class UsersController extends Controller
{
    /**
     * Display a listing of users
     */
    public function index(Request $request): Response
    {
        $search = $request->get('search');
        $role = $request->get('role');

        $query = User::query();

        // Filtro de búsqueda
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Filtro por rol (si el campo existe)
        if ($role && $role !== 'all') {
            $query->where('role', $role);
        }

        $users = $query->orderBy('created_at', 'desc')
                      ->paginate(15)
                      ->withQueryString();

        return Inertia::render('Users/Index', [
            'users' => $users,
            'filters' => [
                'search' => $search,
                'role' => $role,
            ],
            'stats' => [
                'total_users' => User::count(),
                'active_users' => User::where('email_verified_at', '!=', null)->count(),
                'recent_users' => User::where('created_at', '>=', now()->subDays(7))->count(),
            ]
        ]);
    }

    /**
     * Show the form for creating a new user
     */
    public function create(): Response
    {
        return Inertia::render('Users/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UserRequest $request)
    {
        $validated = $request->validated();

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        return redirect()->route('users.index')
            ->with('success', 'Usuario creado exitosamente.');
    }

    /**
     * Display the specified user
     */
    public function show(User $user): Response
    {
        $user->load(['sessions' => function ($query) {
            $query->orderBy('last_activity', 'desc')->limit(5);
        }]);

        return Inertia::render('Users/Show', [
            'user' => $user,
            'last_login' => $user->last_login_at?->diffForHumans(),
            'member_since' => $user->created_at->diffForHumans(),
        ]);
    }

    /**
     * Show the form for editing the specified user
     */
    public function edit(User $user): Response
    {
        return Inertia::render('Users/Edit', [
            'user' => $user
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UserRequest $request, User $user)
    {
        $validated = $request->validated();

        $updateData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
        ];

        // Solo actualizar contraseña si se proporciona
        if (isset($validated['password'])) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        // Si el email cambió, resetear verificación
        if ($user->email !== $validated['email']) {
            $updateData['email_verified_at'] = null;
        }

        $user->update($updateData);

        return redirect()->route('users.index')
            ->with('success', 'Usuario actualizado exitosamente.');
    }

    /**
     * Remove the specified user
     */
    public function destroy(User $user)
    {
                // Prevenir eliminación de cuenta propia
        if ($user->id === Auth::id()) {
            return redirect()->back()->with('error', 'No puedes eliminar tu propia cuenta');
        }

        $userName = $user->name;
        $user->delete();

        return redirect()->route('users.index')
                        ->with('success', "Usuario '{$userName}' eliminado exitosamente.");
    }

    /**
     * Toggle user verification status
     */
    public function toggleVerification(User $user)
    {
        $user->update([
            'email_verified_at' => $user->email_verified_at ? null : now()
        ]);

        $status = $user->email_verified_at ? 'verificado' : 'no verificado';

        return back()->with('success', "Usuario marcado como {$status}.");
    }

    /**
     * Reset user password and send email
     */
    public function resetPassword(User $user)
    {
        // Generar nueva contraseña temporal
        $tempPassword = $this->generateTempPassword();

        $user->update([
            'password' => Hash::make($tempPassword)
        ]);

        // Aquí podrías enviar un email con la nueva contraseña
        // Mail::to($user->email)->send(new TempPasswordMail($tempPassword));

        return back()->with('success', "Contraseña restablecida. Nueva contraseña temporal: {$tempPassword}");
    }

    /**
     * Generate a temporary password
     */
    private function generateTempPassword(): string
    {
        $length = 12;
        $characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';
        $password = '';

        for ($i = 0; $i < $length; $i++) {
            $password .= $characters[rand(0, strlen($characters) - 1)];
        }

        return $password;
    }

    /**
     * Bulk actions for users
     */
    public function bulkAction(Request $request)
    {
        $request->validate([
            'action' => 'required|in:verify,unverify,delete',
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:users,id'
        ]);

        $userIds = collect($request->user_ids)->reject(function ($id) {
            return $id == Auth::id(); // Prevenir acciones en cuenta propia
        });

        $count = 0;

        switch ($request->action) {
            case 'verify':
                User::whereIn('id', $userIds)->update(['email_verified_at' => now()]);
                $count = $userIds->count();
                $message = "Se verificaron {$count} usuarios.";
                break;

            case 'unverify':
                User::whereIn('id', $userIds)->update(['email_verified_at' => null]);
                $count = $userIds->count();
                $message = "Se quitó la verificación a {$count} usuarios.";
                break;

            case 'delete':
                User::whereIn('id', $userIds)->delete();
                $count = $userIds->count();
                $message = "Se eliminaron {$count} usuarios.";
                break;
        }

        return back()->with('success', $message);
    }
}
