<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\TicketCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TicketController extends Controller
{
    public function index()
    {
        $tickets = Ticket::with([
            'categories',
            // Preload match + the two club names only:
            'match' => fn($q) => $q->select('id', 'my_club_id', 'opponent_club_id', 'match_date'),
            'match.myClub:id,name',
            'match.opponent:id,name',
        ])->get();

        $payload = $tickets->map(fn($ticket) => [
            'id'          => $ticket->id,
            'type'        => $ticket->type,
            'description' => $ticket->description,
            'status'      => $ticket->status,
            'categories'  => $ticket->categories,
            'match'       => $ticket->match
                ? $ticket->match->summary()   // or ->summary if you used the accessor
                : null,
        ]);

        return response()->json($payload);
    }

    public function show($id)
    {
        $ticket = Ticket::with([
            'categories',
            'match' => fn($q) => $q->select('id', 'my_club_id', 'opponent_club_id', 'match_date'),
            'match.myClub:id,name',
            'match.opponent:id,name',
        ])->find($id);

        if (! $ticket) {
            return response()->json(['message' => 'Ticket not found'], 404);
        }

        $result = [
            'id'          => $ticket->id,
            'type'        => $ticket->type,
            'description' => $ticket->description,
            'status'      => $ticket->status,
            'categories'  => $ticket->categories,
            'match'       => $ticket->match
                ? $ticket->match->summary()
                : null,
        ];

        return response()->json($result);
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string|in:match,event',
            'matches_id' => 'nullable|exists:matches,id',
            'date' => 'nullable|date',
            'description' => 'required|string',
            'status' => 'required|string|in:available,limited,sold out',
            'categories' => 'required|array',
            'categories.*.id' => 'required|exists:ticket_categories,id',
            'categories.*.price' => 'required|numeric|min:0',
            'categories.*.stock' => 'required|integer|min:0',
        ]);

        // Start a transaction
        DB::beginTransaction();

        try {
            // Create the ticket
            $ticket = Ticket::create([
                'type' => $validated['type'],
                'matches_id' => $validated['type'] === 'match' ? $validated['matches_id'] : null,
                'date' => $validated['type'] === 'event' ? $validated['date'] : null,
                'description' => $validated['description'],
                'status' => $validated['status'],
            ]);

            // Prepare categories data for sync
            $categoryData = [];
            foreach ($validated['categories'] as $category) {
                $categoryData[$category['id']] = [
                    'price' => $category['price'],
                    'stock' => $category['stock'],
                ];
            }

            // Attach categories with custom pivot data
            $ticket->categories()->attach($categoryData);

            DB::commit();

            // Return the ticket with its relationships
            return response()->json(
                Ticket::with(['categories', 'match'])->find($ticket->id),
                201
            );
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to create ticket', 'error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $ticket = Ticket::find($id);
        if (!$ticket) {
            return response()->json(['message' => 'Ticket not found'], 404);
        }

        $validated = $request->validate([
            'type' => 'sometimes|required|string|in:match,event',
            'matches_id' => 'nullable|exists:matches,id',
            'date' => 'nullable|date',
            'description' => 'sometimes|required|string',
            'status' => 'sometimes|required|string|in:available,limited,sold out',
            'categories' => 'sometimes|required|array',
            'categories.*.id' => 'required|exists:ticket_categories,id',
            'categories.*.price' => 'required|numeric|min:0',
            'categories.*.stock' => 'required|integer|min:0',
        ]);

        // Start a transaction
        DB::beginTransaction();

        try {
            // Update the ticket
            $ticket->update([
                'type' => $validated['type'] ?? $ticket->type,
                'matches_id' => isset($validated['type']) && $validated['type'] === 'match' ? $validated['matches_id'] : null,
                'date' => isset($validated['type']) && $validated['type'] === 'event' ? $validated['date'] : null,
                'description' => $validated['description'] ?? $ticket->description,
                'status' => $validated['status'] ?? $ticket->status,
            ]);

            // Sync categories if provided
            if (isset($validated['categories'])) {
                // Prepare categories data for sync
                $categoryData = [];
                foreach ($validated['categories'] as $category) {
                    $categoryData[$category['id']] = [
                        'price' => $category['price'],
                        'stock' => $category['stock'],
                    ];
                }

                // Sync categories with custom pivot data
                $ticket->categories()->sync($categoryData);
            }

            DB::commit();

            // Return the updated ticket with its relationships
            return response()->json(
                Ticket::with(['categories', 'match'])->find($ticket->id)
            );
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to update ticket', 'error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        $ticket = Ticket::find($id);
        if (!$ticket) {
            return response()->json(['message' => 'Ticket not found'], 404);
        }

        // Start a transaction
        DB::beginTransaction();

        try {
            // Detach all categories first (will be done automatically by onDelete cascade, but being explicit)
            $ticket->categories()->detach();

            // Delete the ticket
            $ticket->delete();

            DB::commit();

            return response()->json(['message' => 'Ticket deleted successfully']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to delete ticket', 'error' => $e->getMessage()], 500);
        }
    }

    // public function getCategories()
    // {
    //     $categories = TicketCategory::all();
    //     return response()->json($categories);
    // }
}
