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
            'match' => fn($q) => $q->select('id', 'my_club_id', 'opponent_club_id', 'match_date', "journée"),
            'match.myClub:id,name,stadium_name,logo',
            'match.opponent:id,name,logo',
        ])->get();

        $payload = $tickets->map(fn($ticket) => [
            'id'          => $ticket->id,
            'type'        => $ticket->type,
            'description' => $ticket->description,
            'status'      => $ticket->status,
            'image'       => $ticket->image,
            'location'    => $ticket->location,
            'date'       => $ticket->date,
            'categories'  => $ticket->categories,
            'match'       => $ticket->match
                ? $ticket->match->summary()
                : null,
        ]);

        return response()->json($payload);
    }

    public function show($id)
    {
        $ticket = Ticket::with([
            'categories',
            'match' => fn($q) => $q->select('id', 'my_club_id', 'opponent_club_id', 'match_date', "journée"),
            'match.myClub:id,name,stadium_name,logo',
            'match.opponent:id,name,logo',
        ])->find($id);

        if (! $ticket) {
            return response()->json(['message' => 'Ticket not found'], 404);
        }

        $result = [
            'id'          => $ticket->id,
            'type'        => $ticket->type,
            'description' => $ticket->description,
            'status'      => $ticket->status,
            'image'       => $ticket->image,
            'location'    => $ticket->location,
            'date'       => $ticket->date,
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
            'image' => 'nullable|file|image|max:2048',
            'location' => 'nullable|string',
            'categories' => 'required|array',
            'categories.*.id' => 'required|exists:ticket_categories,id',
            'categories.*.price' => 'required|numeric|min:0',
            'categories.*.stock' => 'required|integer|min:0',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('tickets', 'public');
            $validated['image'] = asset('storage/' . $imagePath);
        } else {
            $validated['image'] = null;
        }

        DB::beginTransaction();

        try {
            $ticket = Ticket::create([
                'type' => $validated['type'],
                'matches_id' => $validated['type'] === 'match' ? $validated['matches_id'] : null,
                'date' => $validated['type'] === 'event' ? $validated['date'] : null,
                'description' => $validated['description'],
                'status' => $validated['status'],
                'image' => $validated['image'],
                'location' => $validated['location'] ?? null,
            ]);

            $categoryData = [];
            foreach ($validated['categories'] as $category) {
                $categoryData[$category['id']] = [
                    'price' => $category['price'],
                    'stock' => $category['stock'],
                ];
            }
            $ticket->categories()->attach($categoryData);

            DB::commit();

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
            'status' => 'sometimes|required|string',
            'image' => 'nullable|file|image|max:2048',
            'location' => 'nullable|string',
            'categories' => 'sometimes|required|array',
            'categories.*.id' => 'required|exists:ticket_categories,id',
            'categories.*.price' => 'required|numeric|min:0',
            'categories.*.stock' => 'required|integer|min:0',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('tickets', 'public');
            $validated['image'] = asset('storage/' . $imagePath);
        }

        DB::beginTransaction();

        try {
            $ticket->update([
                'type' => $validated['type'] ?? $ticket->type,
                'matches_id' => isset($validated['type']) && $validated['type'] === 'match' ? $validated['matches_id'] : null,
                'date' => isset($validated['type']) && $validated['type'] === 'event' ? $validated['date'] : null,
                'description' => $validated['description'] ?? $ticket->description,
                'status' => $validated['status'] ?? $ticket->status,
                'image' => array_key_exists('image', $validated) ? $validated['image'] : $ticket->image,
                'location' => array_key_exists('location', $validated) ? $validated['location'] : $ticket->location,
            ]);

            if (isset($validated['categories'])) {
                $categoryData = [];
                foreach ($validated['categories'] as $category) {
                    $categoryData[$category['id']] = [
                        'price' => $category['price'],
                        'stock' => $category['stock'],
                    ];
                }
                $ticket->categories()->sync($categoryData);
            }

            DB::commit();

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

        DB::beginTransaction();

        try {
            $ticket->categories()->detach();
            $ticket->delete();

            DB::commit();

            return response()->json(['message' => 'Ticket deleted successfully']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to delete ticket', 'error' => $e->getMessage()], 500);
        }
    }

    public function availableTickets()
    {
        $today = now()->toDateString();

        $tickets = Ticket::with([
            'categories',
            'match' => fn($q) => $q->select('id', 'my_club_id', 'opponent_club_id', 'match_date', "journée"),
            'match.myClub:id,name,stadium_name,logo',
            'match.opponent:id,name,logo',
        ])
            ->where('status', 'available')
            ->where(function ($query) use ($today) {
                $query->where(function ($q) use ($today) {
                    $q->where('type', 'event')
                        ->whereDate('date', '>=', $today);
                })
                    ->orWhere(function ($q) use ($today) {
                        $q->where('type', 'match')
                            ->whereHas('match', function ($mq) use ($today) {
                                $mq->whereDate('match_date', '>=', $today);
                            });
                    });
            })
            ->get();

        $payload = $tickets->map(fn($ticket) => [
            'id'          => $ticket->id,
            'type'        => $ticket->type,
            'description' => $ticket->description,
            'status'      => $ticket->status,
            'image'       => $ticket->image,
            'date'       => $ticket->date,
            'location'    => $ticket->location,
            'categories'  => $ticket->categories,
            'match'       => $ticket->match
                ? $ticket->match->summary()
                : null,
        ]);

        return response()->json($payload);
    }
}