<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\ErrorLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminErrorLogController extends Controller
{
    /**
     * List error logs with filters and pagination.
     */
    public function index(Request $request): JsonResponse
    {
        $query = ErrorLog::with('user:id,name,email')
            ->orderByDesc('occurred_at');

        if ($request->filled('status_code')) {
            $query->where('status_code', $request->status_code);
        }

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('message', 'like', "%{$s}%")
                  ->orWhere('url', 'like', "%{$s}%")
                  ->orWhere('route', 'like', "%{$s}%")
                  ->orWhere('exception_class', 'like', "%{$s}%");
            });
        }

        $logs = $query->paginate($request->input('per_page', 25));

        return $this->paginatedSuccess(
            \Illuminate\Http\Resources\Json\JsonResource::collection($logs)->response()->getData(true),
            'Error logs retrieved.'
        );
    }

    /**
     * Get summary stats for the monitoring dashboard.
     */
    public function stats(): JsonResponse
    {
        $total     = ErrorLog::count();
        $today     = ErrorLog::whereDate('occurred_at', today())->count();
        $errors500 = ErrorLog::where('status_code', '>=', 500)->count();
        $errors404 = ErrorLog::where('status_code', 404)->count();

        $topRoutes = ErrorLog::selectRaw('route, count(*) as total')
            ->groupBy('route')
            ->orderByDesc('total')
            ->limit(5)
            ->get();

        $recentTrend = ErrorLog::selectRaw('DATE(occurred_at) as date, count(*) as total')
            ->where('occurred_at', '>=', now()->subDays(7))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $byStatus = ErrorLog::selectRaw('status_code, count(*) as total')
            ->groupBy('status_code')
            ->orderByDesc('total')
            ->get();

        return $this->success([
            'total'        => $total,
            'today'        => $today,
            'errors_500'   => $errors500,
            'errors_404'   => $errors404,
            'top_routes'   => $topRoutes,
            'recent_trend' => $recentTrend,
            'by_status'    => $byStatus,
        ], 'Error stats retrieved.');
    }

    /**
     * Delete a single error log entry.
     */
    public function destroy(ErrorLog $errorLog): JsonResponse
    {
        $errorLog->delete();
        return $this->noContent();
    }

    /**
     * Clear all error logs.
     */
    public function clear(): JsonResponse
    {
        ErrorLog::truncate();
        return $this->success(null, 'All error logs cleared.');
    }
}
