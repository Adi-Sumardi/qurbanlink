<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminAuditController extends Controller
{
    /**
     * List audit logs paginated. Filter by tenant_id, action, auditable_type.
     */
    public function index(Request $request): JsonResponse
    {
        $query = AuditLog::with(['tenant', 'user'])->latest('created_at');

        if ($request->has('tenant_id')) {
            $query->where('tenant_id', $request->input('tenant_id'));
        }

        if ($request->has('action')) {
            $query->where('event', $request->input('action'));
        }

        if ($request->has('auditable_type')) {
            $query->where('auditable_type', $request->input('auditable_type'));
        }

        $logs = $query->paginate($request->input('per_page', 15));

        return $this->paginatedSuccess([
            'data' => $logs->items(),
            'meta' => [
                'current_page' => $logs->currentPage(),
                'from' => $logs->firstItem(),
                'last_page' => $logs->lastPage(),
                'per_page' => $logs->perPage(),
                'to' => $logs->lastItem(),
                'total' => $logs->total(),
                'path' => $logs->path(),
            ],
        ], 'Audit logs retrieved successfully.');
    }
}
