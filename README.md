# Nuber Eats

The Backend of Nuber Eats Clone

- Orders Subscription
    - Pending Orders(Owner) (s: newOrder) (t:  createOrder(newOrder))
    - Order Status(Customer) (s: orderUpdate) (t: editOrder)
    - Pending Pickup Order (Delivery) (s: orderUpdate) (t: editOrder(orderUpdate))

- Payments (CRON)