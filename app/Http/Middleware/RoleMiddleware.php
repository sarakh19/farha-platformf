<?php

namespace App\Http\Middleware;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(
        Request $request,
        Closure $next,
        ...$roles
    ): Response {
        $user = $request->user();//بجيب المستخدم الحالي من التوكن الخاص فيه

        if (!$user || !in_array($user->role, $roles)) {
            return response()->json([
                'message' => 'ليس لديك صلاحية للوصول إلى هذا القسم.',
            ], 403);
        }

        return $next($request);
    }
}
