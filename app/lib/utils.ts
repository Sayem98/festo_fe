export const getUserId = () => {
  try {
    const params = new URLSearchParams((window as any).Telegram.WebApp.initData)

    const userData = Object.fromEntries(params)
    userData.user = JSON.parse(userData.user)

    return userData
  } catch (error) {
    return { user: null }
  }
}

const levelInfo = [
  { level: 1, label: 'Starter', amount: 100000 },
  { level: 2, label: 'Bronze', amount: 500000 },
  { level: 3, label: 'Silver', amount: 5000000 },
  { level: 4, label: 'Gold', amount: 50000000 },
  { level: 5, label: 'Sapphire', amount: 500000000 },
  { level: 6, label: 'Emerald', amount: 5000000000 },
  { level: 7, label: 'Ruby', amount: 50000000000 },
  { level: 8, label: 'Diamond', amount: 500000000000 },
  { level: 9, label: 'Master', amount: 1000000000000 },
  { level: 10, label: 'Legend', amount: 10000000000000 },
]

export const formatAmount = (amount: number) => {
  if (amount >= 1_000_000_000_000)
    return (amount / 1_000_000_000_000).toFixed(1) + 'T'
  if (amount >= 1_000_000_000) return (amount / 1_000_000_000).toFixed(1) + 'B'
  if (amount >= 1_000_000) return (amount / 1_000_000).toFixed(1) + 'M'
  if (amount >= 1_000) return (amount / 1_000).toFixed(1) + 'K'
  return amount
}

export const formattedLevelInfo = levelInfo.map((item) => ({
  ...item,
  amount: formatAmount(item.amount),
}))

export const getLevelInfo = (amount: number) => {
  if (amount >= 0 && amount < 100_000) return { text: 'Starter', number: 1 }
  if (amount >= 100_000 && amount < 500_000)
    return { text: 'Bronze', number: 2 }
  if (amount >= 500_000 && amount < 5_000_000)
    return { text: 'Silver', number: 3 }
  if (amount >= 5_000_000 && amount < 50_000_000)
    return { text: 'Gold', number: 4 }
  if (amount >= 50_000_000 && amount < 500_000_000)
    return { text: 'Sapphire', number: 5 }
  if (amount >= 500_000_000 && amount < 5_000_000_000)
    return { text: 'Emerald', number: 6 }
  if (amount >= 5_000_000_000 && amount < 50_000_000_000)
    return { text: 'Ruby', number: 7 }
  if (amount >= 50_000_000_000 && amount < 500_000_000_000)
    return { text: 'Diamond', number: 8 }
  if (amount >= 500_000_000_000 && amount < 1_000_000_000_000)
    return { text: 'Master', number: 9 }
  if (amount >= 1_000_000_000_000 && amount < 10_000_000_000_000)
    return { text: 'Legend', number: 10 }

  if (amount >= 10_000_000_000_000) return { text: 'God', number: 11 }
}
