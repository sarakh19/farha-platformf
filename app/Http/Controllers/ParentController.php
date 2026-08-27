<?php

namespace App\Http\Controllers;

use App\Models\Registration;
use Illuminate\Http\Request;

class ParentController extends Controller
{
    public function myRegistrations(Request $request)
    {
        $parentId =
            $request->user()->id;


        $registrations =
            Registration::with([
                'event.category',
                'child',
            ])
            ->where(
                'parent_id',
                $parentId
            )
            ->latest()
            ->get();


        return response()->json([
            'registrations' => $registrations,
        ]);
    }
}