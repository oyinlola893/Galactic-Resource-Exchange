;; Transport Coordination Contract

(define-data-var next-shipment-id uint u0)

(define-map shipments
  { shipment-id: uint }
  {
    resource-id: uint,
    quantity: uint,
    origin: (string-ascii 50),
    destination: (string-ascii 50),
    status: (string-ascii 20)
  }
)

(define-public (create-shipment (resource-id uint) (quantity uint) (origin (string-ascii 50)) (destination (string-ascii 50)))
  (let
    ((shipment-id (+ (var-get next-shipment-id) u1)))
    (var-set next-shipment-id shipment-id)
    (ok (map-set shipments
      { shipment-id: shipment-id }
      {
        resource-id: resource-id,
        quantity: quantity,
        origin: origin,
        destination: destination,
        status: "pending"
      }
    ))
  )
)

(define-public (update-shipment-status (shipment-id uint) (new-status (string-ascii 20)))
  (let
    ((shipment (unwrap! (map-get? shipments { shipment-id: shipment-id }) (err u404))))
    (ok (map-set shipments
      { shipment-id: shipment-id }
      (merge shipment { status: new-status })
    ))
  )
)

(define-read-only (get-shipment (shipment-id uint))
  (map-get? shipments { shipment-id: shipment-id })
)

