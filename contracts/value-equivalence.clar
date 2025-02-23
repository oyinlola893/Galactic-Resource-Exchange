;; Value Equivalence Contract

(define-map exchange-rates
  { resource-id: uint }
  { value: uint }
)

(define-public (set-exchange-rate (resource-id uint) (value uint))
  (ok (map-set exchange-rates
    { resource-id: resource-id }
    { value: value }
  ))
)

(define-read-only (get-exchange-rate (resource-id uint))
  (default-to { value: u0 } (map-get? exchange-rates { resource-id: resource-id }))
)

(define-read-only (calculate-value (resource-id uint) (quantity uint))
  (let
    ((rate (get value (get-exchange-rate resource-id))))
    (* rate quantity)
  )
)

