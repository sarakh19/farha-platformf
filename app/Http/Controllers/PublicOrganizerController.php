<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class PublicOrganizerController extends Controller
{
    public function index(Request $request)
    {
        $organizers = User::query()

            ->where('role', 'organizer')
            ->where('is_active', true)

            // البحث باسم المنظم
            ->when($request->search, function ($query, $search) {
                $query->where(
                    'name',
                    'like',
                    '%' . $search . '%'
                );
            })

            // البحث حسب المدينة
            ->when($request->city, function ($query, $city) {
                $query->where(
                    'city',
                    'like',
                    '%' . $city . '%'
                );
            })

            // حسب فئة الفعاليات
            ->when($request->category_id, function ($query, $categoryId) {

                $query->whereHas(
                    'events',
                    function ($eventQuery) use ($categoryId) {

                        $eventQuery
                            ->where('status', 'approved')
                            ->where(
                                'category_id',
                                $categoryId
                            );
                    }
                );
            })

            // عدد الفعاليات المقبولة
            ->withCount([
                'events as approved_events_count' => function ($query) {
                    $query->where(
                        'status',
                        'approved'
                    );
                }
            ])

            ->orderByDesc('approved_events_count')
            ->get();

        return response()->json([
            'organizers' => $organizers,
        ]);
    }
}