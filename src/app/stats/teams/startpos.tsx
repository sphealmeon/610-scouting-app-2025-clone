"use client"

import { Data } from "@/app/interfaces"

interface StartPosProps {
    matches: Data[]
}

export function StartPos({ matches }: StartPosProps) {
    // Calculate percentages for each position
    const totalMatches = matches.length
    const positions = matches.reduce((acc, match) => {
        // Handle case sensitivity and trim whitespace
        const pos = match.start.position.trim().toLowerCase()
        if (pos === 'processor' || pos === 'middle' || pos === 'barge') {
            acc[pos] = (acc[pos] || 0) + 1
        }
        return acc
    }, {} as Record<string, number>)

    const getPercentage = (position: 'processor' | 'middle' | 'barge') => {
        const count = positions[position] || 0
        return totalMatches ? Math.round((count / totalMatches) * 100) : 0
    }

    return (
        <div className="flex gap-4 mt-6">
            <div className="flex-1 border rounded-md p-4 text-center transition-colors hover:bg-gray-950">
                <div className="font-semibold mb-2">Processor</div>
                <div>{getPercentage('processor')}%</div>
                <div className="text-sm text-gray-500">
                    ({positions['processor'] || 0} matches)
                </div>
            </div>
            <div className="flex-1 border rounded-md p-4 text-center transition-colors hover:bg-gray-950">
                <div className="font-semibold mb-2">Middle</div>
                <div>{getPercentage('middle')}%</div>
                <div className="text-sm text-gray-500">
                    ({positions['middle'] || 0} matches)
                </div>
            </div>
            <div className="flex-1 border rounded-md p-4 text-center transition-colors hover:bg-gray-950">
                <div className="font-semibold mb-2">Barge</div>
                <div>{getPercentage('barge')}%</div>
                <div className="text-sm text-gray-500">
                    ({positions['barge'] || 0} matches)
                </div>
            </div>
        </div>
    )
}
