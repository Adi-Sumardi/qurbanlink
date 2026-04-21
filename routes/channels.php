<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return $user->id === $id;
});

// Tenant event scans channel — only users belonging to the tenant can listen
Broadcast::channel('tenant.{tenantId}.event.{eventId}.scans', function ($user, $tenantId) {
    return $user->tenant_id === $tenantId || $user->hasRole('super_admin');
});
