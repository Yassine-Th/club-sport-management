<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with("user", "orderItems.product", "orderItems.size")->orderBy("created_at", "desc")->get();
        if ($orders->isEmpty()) {
            return response()->json(['message' => 'No orders found'], 404);
        }
        return response()->json($orders);
    }
    public function show($id)
    {
        $order = Order::with("user", "orderItems.product", "orderItems.size")->find($id);
        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }
        return response()->json($order);
    }


    public function store(Request $request)
    {
        // 1) validate incoming payload
        $data = $request->validate([
            'items'               => 'required|array|min:1',
            'items.*.id'          => 'required|exists:products,id',
            'items.*.price'       => 'required|numeric',
            'items.*.quantity'    => 'required|integer|min:1',
            'items.*.selectedSize.id'  => 'nullable|exists:sizes,id',
            'shippingInfo.fullName'   => 'required|string',
            'shippingInfo.email'      => 'required|email',
            'shippingInfo.phone'      => 'required|string',
            'shippingInfo.address'    => 'required|string',
            'shippingInfo.city'       => 'required|string',
            'shippingInfo.postalCode' => 'required|string',
            'paymentMethod'       => 'required|string',
            'grandTotal'          => 'required|numeric',
        ]);

        DB::beginTransaction();
        try {
            // 2) create the order
            $order = Order::create([
                'user_id'     => $request->user()->id,
                'total_price' => $data['grandTotal'],
                'status'      => 'pending',
                'ship_full_name'   => $data['shippingInfo']['fullName'],
                'ship_email'      => $data['shippingInfo']['email'],
                'ship_phone'      => $data['shippingInfo']['phone'],
                'ship_address'    => $data['shippingInfo']['address'],
                'ship_city'       => $data['shippingInfo']['city'], 
                'ship_postal_code' => $data['shippingInfo']['postalCode'],
                'payment_method'  => $data['paymentMethod'],
            ]);

            // 3) loop through each item and create an OrderItem
            foreach ($data['items'] as $item) {
                $order->orderItems()->create([
                    'product_id' => $item['id'],
                    'quantity'   => $item['quantity'],
                    'price'      => $item['price'],
                    'size_id'    => $item['selectedSize']['id'] ?? null,

                ]);
            }

            DB::commit();

            return response()->json([
                'message'  => 'Order stored successfully',
                'order_id' => $order->id,
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to store order',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function UserOrders(Request $request)
    {
        $orders = Order::with("orderItems.product","orderItems.size")
            ->orderBy("created_at", "desc")
            ->get();

        return response()->json($orders);
    }
    public function updateStatus(Request $request, Order $order)
    {
        // 2) Validate the new status against your allowed list
        $data = $request->validate([
            'status' => [
                'required',Rule::in(['pending', 'processing', 'completed', 'cancelled', 'shipped', 'paid']),
            ],
        ]);

        // 3) Update and save
        $order->status = $data['status'];
        $order->save();

        // 4) Return the updated order or just a success message
        return response()->json([
            'message' => 'Order status updated',
            'status'  => $order->status,
        ], 200);
    }


}
