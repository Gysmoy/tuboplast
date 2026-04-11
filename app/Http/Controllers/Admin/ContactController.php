<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Contact;

class ContactController extends BasicController
{
    public $reactView = 'Admin/Contacts';
    public $model = Contact::class;
    public $ignoreStatusFilter = true;
}
