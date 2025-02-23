import { describe, it, beforeEach, expect } from "vitest"

describe("Interstellar Trading Contract", () => {
  let mockStorage: Map<string, any>
  let nextTradeId: number
  
  beforeEach(() => {
    mockStorage = new Map()
    nextTradeId = 0
  })
  
  const mockContractCall = (method: string, args: any[], sender: string) => {
    switch (method) {
      case "create-trade":
        const [resourceId, quantity, price] = args
        nextTradeId++
        mockStorage.set(`trade-${nextTradeId}`, {
          seller: sender,
          buyer: sender,
          resource_id: resourceId,
          quantity,
          price,
          status: "open",
        })
        return { success: true, value: nextTradeId }
      
      case "accept-trade":
        const [tradeId] = args
        const trade = mockStorage.get(`trade-${tradeId}`)
        if (!trade) return { success: false, error: 404 }
        if (trade.status !== "open") return { success: false, error: 400 }
        if (trade.seller === sender) return { success: false, error: 403 }
        trade.buyer = sender
        trade.status = "completed"
        return { success: true }
      
      case "get-trade":
        return { success: true, value: mockStorage.get(`trade-${args[0]}`) }
      
      default:
        return { success: false, error: "Unknown method" }
    }
  }
  
  it("should create a trade", () => {
    const result = mockContractCall("create-trade", [1, 100, 1000], "seller1")
    expect(result.success).toBe(true)
    expect(result.value).toBe(1)
  })
  
  it("should accept a trade", () => {
    mockContractCall("create-trade", [1, 100, 1000], "seller1")
    const result = mockContractCall("accept-trade", [1], "buyer1")
    expect(result.success).toBe(true)
  })
  
  it("should not allow seller to accept their own trade", () => {
    mockContractCall("create-trade", [1, 100, 1000], "seller1")
    const result = mockContractCall("accept-trade", [1], "seller1")
    expect(result.success).toBe(false)
    expect(result.error).toBe(403)
  })
  
  it("should get trade information", () => {
    mockContractCall("create-trade", [1, 100, 1000], "seller1")
    const result = mockContractCall("get-trade", [1], "anyone")
    expect(result.success).toBe(true)
    expect(result.value).toEqual({
      seller: "seller1",
      buyer: "seller1",
      resource_id: 1,
      quantity: 100,
      price: 1000,
      status: "open",
    })
  })
})

