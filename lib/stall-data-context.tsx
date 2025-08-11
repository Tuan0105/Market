"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"

export interface Stall {
  id: string
  code: string
  merchantName: string
  businessType: string
  area: number
  status: "occupied" | "vacant" | "expiring" | "maintenance"
  contractEndDate?: string
  monthlyRent: number
  category?: string
  x?: number
  y?: number
  width?: number
  height?: number
}

export interface Zone {
  id: string
  name: string
  category: string
  color: string
  stalls: Stall[]
}

export interface Floor {
  id: string
  name: string
  zones: Zone[]
}

export interface MarketConfig {
  name: string
  floors: Floor[]
}

interface StallDataContextType {
  // Stall Management Data
  stalls: Stall[]
  setStalls: (stalls: Stall[]) => void
  addStall: (stall: Stall) => void
  updateStall: (stallId: string, updates: Partial<Stall>) => void
  deleteStall: (stallId: string) => void
  
  // Market Map Data
  marketConfig: MarketConfig
  setMarketConfig: (config: MarketConfig) => void
  updateZone: (floorId: string, zoneId: string, updates: Partial<Zone>) => void
  addStallToZone: (floorId: string, zoneId: string, stall: Stall) => void
  updateStallInZone: (floorId: string, zoneId: string, stallId: string, updates: Partial<Stall>) => void
  deleteStallFromZone: (floorId: string, zoneId: string, stallId: string) => void
  
  // Synchronization
  syncStallData: () => void
  syncMapData: () => void
}

const StallDataContext = createContext<StallDataContextType | undefined>(undefined)

export function StallDataProvider({ children }: { children: ReactNode }) {
  // Stall Management Data
  const [stalls, setStalls] = useState<Stall[]>([
    {
      id: "1",
      code: "A01",
      merchantName: "Nguyễn Thị Lan",
      businessType: "Thực phẩm tươi sống",
      area: 12,
      status: "occupied",
      contractEndDate: "2025-12-31",
      monthlyRent: 5000000,
    },
    {
      id: "2",
      code: "A02",
      merchantName: "",
      businessType: "",
      area: 15,
      status: "vacant",
      contractEndDate: "",
      monthlyRent: 6000000,
    },
    {
      id: "3",
      code: "B01",
      merchantName: "Trần Văn Hùng",
      businessType: "Gia vị, nước chấm",
      area: 10,
      status: "expiring",
      contractEndDate: "2025-09-15",
      monthlyRent: 4500000,
    },
    {
      id: "4",
      code: "B02",
      merchantName: "Lê Thị Mai",
      businessType: "Rau củ quả",
      area: 8,
      status: "occupied",
      contractEndDate: "2026-03-20",
      monthlyRent: 4000000,
    },
    {
      id: "5",
      code: "C01",
      merchantName: "",
      businessType: "",
      area: 20,
      status: "vacant",
      contractEndDate: "",
      monthlyRent: 8000000,
    },
    {
      id: "6",
      code: "C02",
      merchantName: "Phạm Văn Nam",
      businessType: "Thịt tươi",
      area: 18,
      status: "occupied",
      contractEndDate: "2025-11-30",
      monthlyRent: 7500000,
    },
    {
      id: "7",
      code: "D01",
      merchantName: "Hoàng Thị Hoa",
      businessType: "Hải sản",
      area: 25,
      status: "occupied",
      contractEndDate: "2026-01-15",
      monthlyRent: 9000000,
    },
    {
      id: "8",
      code: "D02",
      merchantName: "Vũ Đình Long",
      businessType: "Gia vị",
      area: 12,
      status: "expiring",
      contractEndDate: "2025-08-20",
      monthlyRent: 5500000,
    },
    {
      id: "9",
      code: "E01",
      merchantName: "",
      businessType: "",
      area: 14,
      status: "vacant",
      contractEndDate: "",
      monthlyRent: 6500000,
    },
    {
      id: "10",
      code: "E02",
      merchantName: "",
      businessType: "",
      area: 16,
      status: "vacant",
      contractEndDate: "",
      monthlyRent: 7000000,
    },
    // Thêm 15 gian hàng nữa để demo pagination
    {
      id: "11",
      code: "A03",
      merchantName: "Ngô Thị Bình",
      businessType: "Trái cây",
      area: 13,
      status: "occupied",
      contractEndDate: "2025-10-15",
      monthlyRent: 5200000,
    },
    {
      id: "12",
      code: "A04",
      merchantName: "",
      businessType: "",
      area: 11,
      status: "vacant",
      contractEndDate: "",
      monthlyRent: 4800000,
    },
    {
      id: "13",
      code: "B03",
      merchantName: "Đỗ Văn Minh",
      businessType: "Gạo, đậu",
      area: 9,
      status: "occupied",
      contractEndDate: "2026-02-28",
      monthlyRent: 4200000,
    },
    {
      id: "14",
      code: "B04",
      merchantName: "",
      businessType: "",
      area: 17,
      status: "vacant",
      contractEndDate: "",
      monthlyRent: 7200000,
    },
    {
      id: "15",
      code: "C03",
      merchantName: "Lý Thị Hương",
      businessType: "Bánh kẹo",
      area: 7,
      status: "occupied",
      contractEndDate: "2025-12-10",
      monthlyRent: 3800000,
    },
    {
      id: "16",
      code: "C04",
      merchantName: "",
      businessType: "",
      area: 19,
      status: "vacant",
      contractEndDate: "",
      monthlyRent: 7800000,
    },
    {
      id: "17",
      code: "D03",
      merchantName: "Trịnh Văn Sơn",
      businessType: "Đồ khô",
      area: 22,
      status: "occupied",
      contractEndDate: "2026-04-15",
      monthlyRent: 8500000,
    },
    {
      id: "18",
      code: "D04",
      merchantName: "",
      businessType: "",
      area: 14,
      status: "vacant",
      contractEndDate: "",
      monthlyRent: 6800000,
    },
    {
      id: "19",
      code: "E03",
      merchantName: "Phan Thị Nga",
      businessType: "Đồ uống",
      area: 8,
      status: "occupied",
      contractEndDate: "2025-11-20",
      monthlyRent: 3600000,
    },
    {
      id: "20",
      code: "E04",
      merchantName: "",
      businessType: "",
      area: 21,
      status: "vacant",
      contractEndDate: "",
      monthlyRent: 8200000,
    },
    {
      id: "21",
      code: "A05",
      merchantName: "Hoàng Văn Tú",
      businessType: "Thực phẩm đông lạnh",
      area: 16,
      status: "occupied",
      contractEndDate: "2026-01-30",
      monthlyRent: 6800000,
    },
    {
      id: "22",
      code: "A06",
      merchantName: "",
      businessType: "",
      area: 12,
      status: "vacant",
      contractEndDate: "",
      monthlyRent: 5200000,
    },
    {
      id: "23",
      code: "B05",
      merchantName: "Võ Thị Lan",
      businessType: "Gia vị khô",
      area: 10,
      status: "occupied",
      contractEndDate: "2025-09-25",
      monthlyRent: 4400000,
    },
    {
      id: "24",
      code: "B06",
      merchantName: "",
      businessType: "",
      area: 18,
      status: "vacant",
      contractEndDate: "",
      monthlyRent: 7400000,
    },
    {
      id: "25",
      code: "C05",
      merchantName: "Nguyễn Văn Hải",
      businessType: "Đồ gia dụng",
      area: 24,
      status: "occupied",
      contractEndDate: "2026-03-10",
      monthlyRent: 9200000,
    },
  ])

  // Market Map Data
  const [marketConfig, setMarketConfig] = useState<MarketConfig>({
    name: "Chợ Trung Tâm",
    floors: [
      {
        id: "1",
        name: "Tầng 1",
        zones: [
          {
            id: "A",
            name: "Khu A - Thực phẩm tươi sống",
            category: "food",
            color: "#10b981",
            stalls: [
              { 
                id: "1", 
                code: "A01", 
                x: 80, 
                y: 80, 
                width: 40, 
                height: 30, 
                merchantName: "Nguyễn Thị Lan", 
                businessType: "Thực phẩm tươi sống", 
                status: "occupied", 
                category: "food", 
                monthlyRent: 5000000, 
                area: 12, 
                contractEndDate: "2025-12-31" 
              },
              { 
                id: "2", 
                code: "A02", 
                x: 140, 
                y: 80, 
                width: 40, 
                height: 30, 
                merchantName: "", 
                businessType: "", 
                status: "vacant", 
                category: "food", 
                monthlyRent: 6000000, 
                area: 15 
              },
              { 
                id: "11", 
                code: "A03", 
                x: 200, 
                y: 80, 
                width: 40, 
                height: 30, 
                merchantName: "Ngô Thị Bình", 
                businessType: "Trái cây", 
                status: "occupied", 
                category: "food", 
                monthlyRent: 5200000, 
                area: 13, 
                contractEndDate: "2025-10-15" 
              },
              { 
                id: "12", 
                code: "A04", 
                x: 260, 
                y: 80, 
                width: 40, 
                height: 30, 
                merchantName: "", 
                businessType: "", 
                status: "vacant", 
                category: "food", 
                monthlyRent: 4800000, 
                area: 11 
              },
              { 
                id: "21", 
                code: "A05", 
                x: 80, 
                y: 130, 
                width: 40, 
                height: 30, 
                merchantName: "Hoàng Văn Tú", 
                businessType: "Thực phẩm đông lạnh", 
                status: "occupied", 
                category: "food", 
                monthlyRent: 6800000, 
                area: 16, 
                contractEndDate: "2026-01-30" 
              },
              { 
                id: "22", 
                code: "A06", 
                x: 140, 
                y: 130, 
                width: 40, 
                height: 30, 
                merchantName: "", 
                businessType: "", 
                status: "vacant", 
                category: "food", 
                monthlyRent: 5200000, 
                area: 12 
              },
            ]
          },
          {
            id: "B",
            name: "Khu B - Rau củ quả",
            category: "vegetables",
            color: "#84cc16",
            stalls: [
              { 
                id: "3", 
                code: "B01", 
                x: 430, 
                y: 80, 
                width: 35, 
                height: 25, 
                merchantName: "Trần Văn Hùng", 
                businessType: "Gia vị, nước chấm", 
                status: "expiring", 
                category: "vegetables", 
                monthlyRent: 4500000, 
                area: 10, 
                contractEndDate: "2025-09-15" 
              },
              { 
                id: "4", 
                code: "B02", 
                x: 480, 
                y: 80, 
                width: 35, 
                height: 25, 
                merchantName: "Lê Thị Mai", 
                businessType: "Rau củ quả", 
                status: "occupied", 
                category: "vegetables", 
                monthlyRent: 4000000, 
                area: 8, 
                contractEndDate: "2026-03-20" 
              },
              { 
                id: "13", 
                code: "B03", 
                x: 530, 
                y: 80, 
                width: 35, 
                height: 25, 
                merchantName: "Đỗ Văn Minh", 
                businessType: "Gạo, đậu", 
                status: "occupied", 
                category: "vegetables", 
                monthlyRent: 4200000, 
                area: 9, 
                contractEndDate: "2026-02-28" 
              },
              { 
                id: "14", 
                code: "B04", 
                x: 580, 
                y: 80, 
                width: 35, 
                height: 25, 
                merchantName: "", 
                businessType: "", 
                status: "vacant", 
                category: "vegetables", 
                monthlyRent: 7200000, 
                area: 17 
              },
              { 
                id: "23", 
                code: "B05", 
                x: 430, 
                y: 120, 
                width: 35, 
                height: 25, 
                merchantName: "Võ Thị Lan", 
                businessType: "Gia vị khô", 
                status: "occupied", 
                category: "vegetables", 
                monthlyRent: 4400000, 
                area: 10, 
                contractEndDate: "2025-09-25" 
              },
              { 
                id: "24", 
                code: "B06", 
                x: 480, 
                y: 120, 
                width: 35, 
                height: 25, 
                merchantName: "", 
                businessType: "", 
                status: "vacant", 
                category: "vegetables", 
                monthlyRent: 7400000, 
                area: 18 
              },
            ]
          },
          {
            id: "C",
            name: "Khu C - Thịt & Hải sản",
            category: "meat",
            color: "#ef4444",
            stalls: [
              { 
                id: "5", 
                code: "C01", 
                x: 780, 
                y: 80, 
                width: 45, 
                height: 35, 
                merchantName: "", 
                businessType: "", 
                status: "vacant", 
                category: "meat", 
                monthlyRent: 8000000, 
                area: 20 
              },
              { 
                id: "6", 
                code: "C02", 
                x: 840, 
                y: 80, 
                width: 45, 
                height: 35, 
                merchantName: "Phạm Văn Nam", 
                businessType: "Thịt tươi", 
                status: "occupied", 
                category: "meat", 
                monthlyRent: 7500000, 
                area: 18, 
                contractEndDate: "2025-11-30" 
              },
              { 
                id: "15", 
                code: "C03", 
                x: 900, 
                y: 80, 
                width: 45, 
                height: 35, 
                merchantName: "Lý Thị Hương", 
                businessType: "Bánh kẹo", 
                status: "occupied", 
                category: "meat", 
                monthlyRent: 3800000, 
                area: 7, 
                contractEndDate: "2025-12-10" 
              },
              { 
                id: "16", 
                code: "C04", 
                x: 960, 
                y: 80, 
                width: 45, 
                height: 35, 
                merchantName: "", 
                businessType: "", 
                status: "vacant", 
                category: "meat", 
                monthlyRent: 7800000, 
                area: 19 
              },
              { 
                id: "25", 
                code: "C05", 
                x: 780, 
                y: 130, 
                width: 45, 
                height: 35, 
                merchantName: "Nguyễn Văn Hải", 
                businessType: "Đồ gia dụng", 
                status: "occupied", 
                category: "meat", 
                monthlyRent: 9200000, 
                area: 24, 
                contractEndDate: "2026-03-10" 
              },
            ]
          },
          {
            id: "D",
            name: "Khu D - Gia vị & Đồ khô",
            category: "spices",
            color: "#3b82f6",
            stalls: [
              { 
                id: "7", 
                code: "D01", 
                x: 1130, 
                y: 80, 
                width: 50, 
                height: 40, 
                merchantName: "Hoàng Thị Hoa", 
                businessType: "Hải sản", 
                status: "occupied", 
                category: "spices", 
                monthlyRent: 9000000, 
                area: 25, 
                contractEndDate: "2026-01-15" 
              },
              { 
                id: "8", 
                code: "D02", 
                x: 1190, 
                y: 80, 
                width: 50, 
                height: 40, 
                merchantName: "Vũ Đình Long", 
                businessType: "Gia vị", 
                status: "expiring", 
                category: "spices", 
                monthlyRent: 5500000, 
                area: 12, 
                contractEndDate: "2025-08-20" 
              },
              { 
                id: "17", 
                code: "D03", 
                x: 1250, 
                y: 80, 
                width: 50, 
                height: 40, 
                merchantName: "Trịnh Văn Sơn", 
                businessType: "Đồ khô", 
                status: "occupied", 
                category: "spices", 
                monthlyRent: 8500000, 
                area: 22, 
                contractEndDate: "2026-04-15" 
              },
              { 
                id: "18", 
                code: "D04", 
                x: 1310, 
                y: 80, 
                width: 50, 
                height: 40, 
                merchantName: "", 
                businessType: "", 
                status: "vacant", 
                category: "spices", 
                monthlyRent: 6800000, 
                area: 14 
              },
            ]
          },
          {
            id: "E",
            name: "Khu E - Đồ uống & Giải khát",
            category: "beverages",
            color: "#f59e0b",
            stalls: [
              { 
                id: "9", 
                code: "E01", 
                x: 1480, 
                y: 80, 
                width: 40, 
                height: 30, 
                merchantName: "", 
                businessType: "", 
                status: "vacant", 
                category: "beverages", 
                monthlyRent: 6500000, 
                area: 14 
              },
              { 
                id: "10", 
                code: "E02", 
                x: 1540, 
                y: 80, 
                width: 40, 
                height: 30, 
                merchantName: "", 
                businessType: "", 
                status: "vacant", 
                category: "beverages", 
                monthlyRent: 7000000, 
                area: 16 
              },
              { 
                id: "19", 
                code: "E03", 
                x: 1600, 
                y: 80, 
                width: 40, 
                height: 30, 
                merchantName: "Phan Thị Nga", 
                businessType: "Đồ uống", 
                status: "occupied", 
                category: "beverages", 
                monthlyRent: 3600000, 
                area: 8, 
                contractEndDate: "2025-11-20" 
              },
              { 
                id: "20", 
                code: "E04", 
                x: 1660, 
                y: 80, 
                width: 40, 
                height: 30, 
                merchantName: "", 
                businessType: "", 
                status: "vacant", 
                category: "beverages", 
                monthlyRent: 8200000, 
                area: 21 
              },
            ]
          }
        ]
      }
    ]
  })

  // Stall Management Functions
  const addStall = (stall: Stall) => {
    setStalls(prev => [...prev, stall])
  }

  const updateStall = (stallId: string, updates: Partial<Stall>) => {
    setStalls(prev => prev.map(stall => 
      stall.id === stallId ? { ...stall, ...updates } : stall
    ))
  }

  const deleteStall = (stallId: string) => {
    setStalls(prev => prev.filter(stall => stall.id !== stallId))
  }

  // Market Map Functions
  const updateZone = (floorId: string, zoneId: string, updates: Partial<Zone>) => {
    setMarketConfig(prev => ({
      ...prev,
      floors: prev.floors.map(floor => 
        floor.id === floorId 
          ? {
              ...floor,
              zones: floor.zones.map(zone => 
                zone.id === zoneId 
                  ? { ...zone, ...updates }
                  : zone
              )
            }
          : floor
      )
    }))
  }

  const addStallToZone = (floorId: string, zoneId: string, stall: Stall) => {
    setMarketConfig(prev => ({
      ...prev,
      floors: prev.floors.map(floor => 
        floor.id === floorId 
          ? {
              ...floor,
              zones: floor.zones.map(zone => 
                zone.id === zoneId 
                  ? { ...zone, stalls: [...zone.stalls, stall] }
                  : zone
              )
            }
          : floor
      )
    }))
  }

  const updateStallInZone = (floorId: string, zoneId: string, stallId: string, updates: Partial<Stall>) => {
    setMarketConfig(prev => ({
      ...prev,
      floors: prev.floors.map(floor => 
        floor.id === floorId 
          ? {
              ...floor,
              zones: floor.zones.map(zone => 
                zone.id === zoneId 
                  ? {
                      ...zone,
                      stalls: zone.stalls.map(stall => 
                        stall.id === stallId 
                          ? { ...stall, ...updates }
                          : stall
                      )
                    }
                  : zone
              )
            }
          : floor
      )
    }))
  }

  const deleteStallFromZone = (floorId: string, zoneId: string, stallId: string) => {
    setMarketConfig(prev => ({
      ...prev,
      floors: prev.floors.map(floor => 
        floor.id === floorId 
          ? {
              ...floor,
              zones: floor.zones.map(zone => 
                zone.id === zoneId 
                  ? {
                      ...zone,
                      stalls: zone.stalls.filter(stall => stall.id !== stallId)
                    }
                  : zone
              )
            }
          : floor
      )
    }))
  }

  // Synchronization Functions
  const syncStallData = () => {
    // Sync stall management data to market map
    setMarketConfig(prev => ({
      ...prev,
      floors: prev.floors.map(floor => ({
        ...floor,
        zones: floor.zones.map(zone => ({
          ...zone,
          stalls: zone.stalls.map(stall => {
            const stallData = stalls.find(s => s.code === stall.code)
            if (stallData) {
              return {
                ...stall,
                merchantName: stallData.merchantName,
                businessType: stallData.businessType,
                status: stallData.status,
                contractEndDate: stallData.contractEndDate,
                monthlyRent: stallData.monthlyRent,
                area: stallData.area
              }
            }
            return stall
          })
        }))
      }))
    }))
  }

  const syncMapData = () => {
    // Sync market map data to stall management
    const allStalls: Stall[] = []
    marketConfig.floors.forEach(floor => {
      floor.zones.forEach(zone => {
        zone.stalls.forEach(stall => {
          allStalls.push({
            id: stall.id,
            code: stall.code,
            merchantName: stall.merchantName,
            businessType: stall.businessType,
            area: stall.area,
            status: stall.status,
            contractEndDate: stall.contractEndDate,
            monthlyRent: stall.monthlyRent
          })
        })
      })
    })
    setStalls(allStalls)
  }

  const value: StallDataContextType = {
    stalls,
    setStalls,
    addStall,
    updateStall,
    deleteStall,
    marketConfig,
    setMarketConfig,
    updateZone,
    addStallToZone,
    updateStallInZone,
    deleteStallFromZone,
    syncStallData,
    syncMapData
  }

  return (
    <StallDataContext.Provider value={value}>
      {children}
    </StallDataContext.Provider>
  )
}

export function useStallData() {
  const context = useContext(StallDataContext)
  if (context === undefined) {
    throw new Error('useStallData must be used within a StallDataProvider')
  }
  return context
}
