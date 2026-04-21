<?php

namespace App\Http\Resources;

use App\Models\Plan;
use Illuminate\Http\Resources\Json\JsonResource;

class SubscriptionResource extends JsonResource
{
    public function toArray($request): array
    {
        $planSlug = $this->plan instanceof \BackedEnum
            ? $this->plan->value
            : $this->plan;

        $planDetails = Plan::where('slug', $planSlug)->first();

        return [
            'id'               => $this->id,
            'plan'             => $this->plan,
            'status'           => $this->status,
            'coupon_quota'     => $this->coupon_quota,
            'coupon_used'      => $this->coupon_used,
            'coupon_remaining' => $this->coupon_quota - $this->coupon_used,
            'price'            => $this->price,
            'billing_cycle'    => $this->billing_cycle,
            'starts_at'        => $this->starts_at,
            'expires_at'       => $this->expires_at,
            'grace_ends_at'    => $this->grace_ends_at,
            'cancelled_at'     => $this->cancelled_at,
            'plan_details'     => $planDetails,
            'created_at'       => $this->created_at,
        ];
    }
}
