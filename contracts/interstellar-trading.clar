;; Interstellar Trading Contract

(define-data-var next-trade-id uint u0)

(define-map trades
  { trade-id: uint }
  {
    seller: principal,
    buyer: principal,
    resource-id: uint,
    quantity: uint,
    price: uint,
    status: (string-ascii 20)
  }
)

(define-public (create-trade (resource-id uint) (quantity uint) (price uint))
  (let
    ((trade-id (+ (var-get next-trade-id) u1)))
    (var-set next-trade-id trade-id)
    (ok (map-set trades
      { trade-id: trade-id }
      {
        seller: tx-sender,
        buyer: tx-sender,
        resource-id: resource-id,
        quantity: quantity,
        price: price,
        status: "open"
      }
    ))
  )
)

(define-public (accept-trade (trade-id uint))
  (let
    ((trade (unwrap! (map-get? trades { trade-id: trade-id }) (err u404))))
    (asserts! (is-eq (get status trade) "open") (err u400))
    (asserts! (not (is-eq (get seller trade) tx-sender)) (err u403))
    (ok (map-set trades
      { trade-id: trade-id }
      (merge trade { buyer: tx-sender, status: "completed" })
    ))
  )
)

(define-read-only (get-trade (trade-id uint))
  (map-get? trades { trade-id: trade-id })
)


;; title: interstellar-trading
;; version:
;; summary:
;; description:

;; traits
;;

;; token definitions
;;

;; constants
;;

;; data vars
;;

;; data maps
;;

;; public functions
;;

;; read only functions
;;

;; private functions
;;

