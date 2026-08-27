<?php

namespace App\Http\Controllers;

use App\Models\Child;
use Illuminate\Http\Request;

class ChildController extends Controller
{
    /*
     * عرض أطفال ولي الأمر الحالي
     */
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'parent') {
            return response()->json([
                'message' => 'غير مصرح لك بعرض الأطفال.',
            ], 403);
        }

        $children = Child::where('user_id', $user->id)
            ->latest()
            ->get();

        return response()->json([
            'children' => $children,
        ]);
    }


    /*
     * إضافة طفل جديد
     */
    public function store(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'parent') {
            return response()->json([
                'message' => 'غير مصرح لك بإضافة طفل.',
            ], 403);
        }

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'birth_date' => [
                'nullable',
                'date',
                'before_or_equal:today',
            ],

            'gender' => [
                'nullable',
                'in:male,female',
            ],

            'notes' => [
                'nullable',
                'string',
                'max:1000',
            ],
        ]);

        $child = Child::create([
            'user_id' => $user->id,
            'name' => $validated['name'],
            'birth_date' => $validated['birth_date'] ?? null,
            'gender' => $validated['gender'] ?? null,
            'notes' => $validated['notes'] ?? null,
        ]);

        return response()->json([
            'message' => 'تمت إضافة الطفل بنجاح.',
            'child' => $child,
        ], 201);
    }


    /*
     * عرض طفل واحد
     */
    public function show(Request $request, Child $child)
    {
        $this->authorizeChild($request, $child);

        return response()->json([
            'child' => $child,
        ]);
    }


    /*
     * تعديل طفل
     */
    public function update(Request $request, Child $child)
    {
        $this->authorizeChild($request, $child);

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'birth_date' => [
                'nullable',
                'date',
                'before_or_equal:today',
            ],

            'gender' => [
                'nullable',
                'in:male,female',
            ],

            'notes' => [
                'nullable',
                'string',
                'max:1000',
            ],
        ]);

        $child->update([
            'name' => $validated['name'],
            'birth_date' => $validated['birth_date'] ?? null,
            'gender' => $validated['gender'] ?? null,
            'notes' => $validated['notes'] ?? null,
        ]);

        return response()->json([
            'message' => 'تم تحديث بيانات الطفل بنجاح.',
            'child' => $child->fresh(),
        ]);
    }


    /*
     * حذف طفل
     */
    public function destroy(Request $request, Child $child)
    {
        $this->authorizeChild($request, $child);

        $child->delete();

        return response()->json([
            'message' => 'تم حذف الطفل بنجاح.',
        ]);
    }


    /*
     * التأكد إن الطفل تابع للمستخدم الحالي
     */
    private function authorizeChild(Request $request, Child $child): void
    {
        $user = $request->user();

        if (
            $user->role !== 'parent' ||
            $child->user_id !== $user->id
        ) {
            abort(
                response()->json([
                    'message' => 'غير مصرح لك بتنفيذ هذا الإجراء.',
                ], 403)
            );
        }
    }
}