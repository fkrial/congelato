import { type NextRequest, NextResponse } from "next/server"

interface Reward {
  id: string
  name: string
  description: string
  points_required: number
  reward_type: "discount" | "free_item" | "upgrade" | "special_offer"
  value: number
  category: string
  active: boolean
  expiry_date?: string
  usage_limit?: number
  used_count: number
  membership_levels: string[]
}

const rewards: Reward[] = [
  {
    id: "reward_001",
    name: "10% de Descuento",
    description: "10% de descuento en tu próxima compra",
    points_required: 100,
    reward_type: "discount",
    value: 10,
    category: "descuentos",
    active: true,
    usage_limit: 1000,
    used_count: 45,
    membership_levels: ["bronze", "silver", "gold", "platinum"],
  },
  {
    id: "reward_002",
    name: "Croissant Gratis",
    description: "Croissant clásico gratis",
    points_required: 150,
    reward_type: "free_item",
    value: 5,
    category: "productos_gratis",
    active: true,
    usage_limit: 500,
    used_count: 23,
    membership_levels: ["silver", "gold", "platinum"],
  },
  {
    id: "reward_003",
    name: "Upgrade a Premium",
    description: "Upgrade gratis a versión premium de cualquier producto",
    points_required: 200,
    reward_type: "upgrade",
    value: 8,
    category: "upgrades",
    active: true,
    usage_limit: 200,
    used_count: 12,
    membership_levels: ["gold", "platinum"],
  },
  {
    id: "reward_004",
    name: "Torta de Cumpleaños 50% OFF",
    description: "50% de descuento en torta personalizada",
    points_required: 500,
    reward_type: "special_offer",
    value: 50,
    category: "ofertas_especiales",
    active: true,
    expiry_date: "2024-12-31",
    usage_limit: 50,
    used_count: 8,
    membership_levels: ["platinum"],
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const membershipLevel = searchParams.get("membership_level")
  const category = searchParams.get("category")

  let filteredRewards = rewards.filter((reward) => reward.active)

  if (membershipLevel) {
    filteredRewards = filteredRewards.filter((reward) => reward.membership_levels.includes(membershipLevel))
  }

  if (category) {
    filteredRewards = filteredRewards.filter((reward) => reward.category === category)
  }

  return NextResponse.json({ rewards: filteredRewards })
}

export async function POST(request: NextRequest) {
  try {
    const rewardData = await request.json()

    const newReward: Reward = {
      id: `reward_${Date.now()}`,
      used_count: 0,
      active: true,
      membership_levels: ["bronze", "silver", "gold", "platinum"],
      ...rewardData,
    }

    rewards.push(newReward)

    return NextResponse.json({ success: true, reward: newReward })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create reward" }, { status: 500 })
  }
}
