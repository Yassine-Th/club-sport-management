<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request)
    {
        // Get the authenticated user
        $user = $request->user();

        // Return the user data as JSON
        return response()->json($user);
    }

    public function show(Request $request)
    {
        // Get the authenticated user
        $user = $request->user();

        // Return the user data as JSON
        return response()->json($user);
    }

    public function update(Request $request)
    {
        // Validate the request data
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'phone' => 'required|string|max:255',
            'address' => 'required|string|max:255',
        ]);

        // Get the authenticated user
        $user = $request->user();

        // Update the user's information
        $user->update($request->all());

        // Return the updated user data as JSON
        return response()->json($user);
    }
    public function destroy(Request $request)
    {
        // Get the authenticated user
        $user = $request->user();

        // Delete the user
        $user->delete();

        // Return a success message
        return response()->json(['message' => 'User deleted successfully']);
    }
   
}
