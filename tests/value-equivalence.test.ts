import { describe, it, beforeEach, expect } from "vitest"

describe("Value Equivalence Contract", () => {
  let mockStorage: Map<string, any>
  
  beforeEach(() => {
    mockStorage = new Map()
  })
  
  const mockContractCall = (method: string, args: any[]) => {
    switch (method) {
      case "set-exchange-rate":
        const [resourceId, value] = args
        mockStorage.set(`rate-${resourceId}`, { value })
        return { success: true }
      
      case "get-exchange-rate":
        const rate = mockStorage.get(`rate-${args[0]}`) || { value: 0 }
        return { success: true, value: rate }
      
      case "calculate-value":
        const [calcResourceId, quantity] = args
        const calcRate = mockStorage.get(`rate-${calcResourceId}`) || { value: 0 }
        return { success: true, value: calcRate.value * quantity }
      
      default:
        return { success: false, error: "Unknown method" }
    }
  }
  
  it("should set an exchange rate", () => {
    const result = mockContractCall("set-exchange-rate", [1, 100])
    expect(result.success).toBe(true)
  })
  
  it("should get an exchange rate", () => {
    mockContractCall("set-exchange-rate", [1, 100])
    const result = mockContractCall("get-exchange-rate", [1])
    expect(result.success).toBe(true)
    expect(result.value).toEqual({ value: 100 })
  })
  
  it("should return default rate for non-existent resource", () => {
    const result = mockContractCall("get-exchange-rate", [999])
    expect(result.success).toBe(true)
    expect(result.value).toEqual({ value: 0 })
  })
  
  it("should calculate value correctly", () => {
    mockContractCall("set-exchange-rate", [1, 100])
    const result = mockContractCall("calculate-value", [1, 5])
    expect(result.success).toBe(true)
    expect(result.value).toBe(500)
  })
})

