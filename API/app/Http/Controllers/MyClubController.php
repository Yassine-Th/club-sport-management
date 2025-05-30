<?php

namespace App\Http\Controllers;

use App\Models\MyClub;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MyClubController extends Controller
{


    public function index() {
        $myclub = MyClub::first();
        return response()->json([
            'myclub' => $myclub
        ]);
    }

     public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:100', 
            'city' => 'required|string|max:100', 
            'founded' => 'required|digits:4|integer|min:1800|max:' . date('Y'), 
            'stadium_name' => 'required|string|max:150',
            'stadium_capacity' => 'required|integer|min:1000|max:150000',
            'president' => 'required|string|max:100', 
            'coach_name' => 'required|string|max:100',
            'description' => 'required|string|max:1000', 
            'logo' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        MyClub::create([
            'name' => $validatedData['name'],
            'city' => $validatedData['city'],
            'founded' => $validatedData['founded'],
            'stadium_name' => $validatedData['stadium_name'],
            'stadium_capacity' => $validatedData['stadium_capacity'],
            'president' => $validatedData['president'],
            'coach_name' => $validatedData['coach_name'],
            'description' => $validatedData['description'],
            'logo' => $request->hasFile('logo') ? $request->file('logo')->store('images', 'public') : null,
        ]);

        return response()->json([
            'message' => 'my club created successfully',
        ])->setStatusCode(201);
    }


    public function edit($id)
{
    $monclub = MyClub::findOrFail($id);
    return response()->json([
        'monclub' => $monclub,
        'message' => 'Player fetched successfully'
    ]);
}



public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:100', 
            'city' => 'required|string|max:100', 
            'founded' => 'required|digits:4|integer|min:1800|max:' . date('Y'), 
            'stadium_name' => 'required|string|max:150',
            'stadium_capacity' => 'required|integer|min:1000|max:150000',
            'president' => 'required|string|max:100', 
            'coach_name' => 'required|string|max:100',
            'description' => 'required|string|max:1000', 
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $monclub = MyClub::findOrFail($id);

        if (!$monclub) {
        return response()->json([
            'message' => 'mon club  not found.'
        ], 404);
    }

        $monclub->name = $validatedData['name'];
        $monclub->city = $validatedData['city'];
        $monclub->founded = $validatedData['founded'];
        $monclub->stadium_name = $validatedData['stadium_name'];
        $monclub->stadium_capacity = $validatedData['stadium_capacity'];
        $monclub->president = $validatedData['president'];
        $monclub->coach_name = $validatedData['coach_name'];
        $monclub->description = $validatedData['description'];

    if ($request->hasFile('logo')) {
      
        // رفع الصورة الجديدة
        $monclub->logo =  $request->hasFile('logo') ? $request->file('logo')->store('images', 'public') : null;

    }

    $monclub->save();

        return response()->json([
            'message' => 'my club Updated successfully',
        ])->setStatusCode(201);
    }
}
