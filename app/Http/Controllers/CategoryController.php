<?php

namespace App\Http\Controllers;

use App\Models\Category;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CategoryController extends Controller
{
    /* =========================================================
       List Categories
    ========================================================= */

    public function index()
    {
        $categories =
            Category::withCount(
                'events'
            )
            ->orderBy(
                'name'
            )
            ->get();


        return response()->json([
            'categories' =>
                $categories,
        ]);
    }


    /* =========================================================
       Create Category
    ========================================================= */

    public function store(
        Request $request
    ) {

        $validated =
            $request->validate([

                'name' => [
                    'required',
                    'string',
                    'max:255',
                    'unique:categories,name',
                ],

                'description' => [
                    'nullable',
                    'string',
                    'max:1000',
                ],

            ]);


        $category =
            Category::create([
                'name' =>
                    $validated['name'],

                'description' =>
                    $validated['description']
                    ?? null,
            ]);


        $category->loadCount(
            'events'
        );


        return response()->json([

            'message' =>
                'تم إضافة التصنيف بنجاح.',

            'category' =>
                $category,

        ], 201);
    }


    /* =========================================================
       Update Category
    ========================================================= */

    public function update(
        Request $request,
        Category $category
    ) {

        $validated =
            $request->validate([

                'name' => [
                    'required',
                    'string',
                    'max:255',

                    Rule::unique(
                        'categories',
                        'name'
                    )
                    ->ignore(
                        $category->id
                    ),
                ],

                'description' => [
                    'nullable',
                    'string',
                    'max:1000',
                ],

            ]);


        $category->update([

            'name' =>
                $validated['name'],

            'description' =>
                $validated['description']
                ?? null,

        ]);


        $category->loadCount(
            'events'
        );


        return response()->json([

            'message' =>
                'تم تحديث التصنيف بنجاح.',

            'category' =>
                $category,

        ]);
    }


    /* =========================================================
       Delete Category
    ========================================================= */

    public function destroy(
        Category $category
    ) {

        /*
         * لا نحذف التصنيف إذا كان مستخدمًا
         * في أي فعالية.
         */

        if (
            $category
                ->events()
                ->exists()
        ) {

            return response()->json([

                'message' =>
                    'لا يمكن حذف هذا التصنيف لأنه مرتبط بفعاليات موجودة.',

            ], 422);
        }


        $category->delete();


        return response()->json([

            'message' =>
                'تم حذف التصنيف بنجاح.',

        ]);
    }
}