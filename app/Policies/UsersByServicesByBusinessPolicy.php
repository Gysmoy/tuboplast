<?php

namespace App\Policies;

use App\Models\User;
use App\Models\UsersByServicesByBusiness;
use Illuminate\Auth\Access\Response;

class UsersByServicesByBusinessPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        //
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, UsersByServicesByBusiness $usersByServicesByBusiness): bool
    {
        //
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        //
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, UsersByServicesByBusiness $usersByServicesByBusiness): bool
    {
        //
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, UsersByServicesByBusiness $usersByServicesByBusiness): bool
    {
        //
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, UsersByServicesByBusiness $usersByServicesByBusiness): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, UsersByServicesByBusiness $usersByServicesByBusiness): bool
    {
        //
    }
}
