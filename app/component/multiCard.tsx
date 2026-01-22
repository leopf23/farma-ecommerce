import React from 'react'

type Product = {
    id: string | number
    title: string
    subtitle?: string
    price?: string
    image?: string
}

function chunkArray<T>(arr: T[], size: number) {
    const chunks: T[][] = []
    for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size))
    return chunks
}

const defaultProducts: Product[] = [
    { id: 1, title: 'Multi-vitaminas', subtitle: 'Gloryfeel · Cap 450', image: '/producto2.png' },
    { id: 2, title: 'Winasorb Infantil', subtitle: 'Jarabe. Abbot, 60ml' },
    { id: 3, title: 'Rangel Complejo B', subtitle: 'Suplemento vitaminico', image: '/producto2.png' },
    { id: 4, title: 'Winasorb Infantil', subtitle: 'Jarabe. Abbot, 60ml' },
    { id: 5, title: 'Winasorb Infantil', subtitle: 'Jarabe. Abbot, 60ml' },
]

function getPositionClassesForFive(index: number) {
    // Use explicit col/row start/span to avoid overlapping areas.
    // Grid is `lg:grid-cols-4 lg:grid-rows:2` so there are 8 cells on large screens.
    switch (index) {
        case 0:
            // big left card spanning 2 columns and 2 rows
            return 'lg:col-span-2 lg:row-span-2'
        case 1:
            return 'lg:col-start-3 lg:row-start-1'
        case 2:
            return 'lg:col-start-4 lg:row-start-1'
        case 3:
            return 'lg:col-start-3 lg:row-start-2'
        case 4:
            return 'lg:col-start-4 lg:row-start-2'
        default:
            return ''
    }
}

function getRandomPositionsForLessThanFive(len: number) {
    // Provide a few layout templates for remainder blocks (1..4)
    const templates: Record<number, string[][]> = {
        1: [['lg:col-span-4 lg:row-span-2']],
        2: [
            ['lg:col-start-1 lg:col-span-2 lg:row-start-1', 'lg:col-start-3 lg:col-span-2 lg:row-start-1'],
            ['lg:col-start-1 lg:col-span-1 lg:row-start-1', 'lg:col-start-2 lg:col-span-3 lg:row-start-1'],
        ],
        3: [
            ['lg:col-start-1 lg:col-span-2 lg:row-start-1', 'lg:col-start-3 lg:row-start-1', 'lg:col-start-4 lg:row-start-1'],
        ],
        4: [
            ['lg:col-start-1 lg:col-span-2 lg:row-start-1', 'lg:col-start-3 lg:row-start-1', 'lg:col-start-4 lg:row-start-1', 'lg:col-start-3 lg:row-start-2'],
        ],
    }

    const choices = templates[len] || []
    const pick = choices[Math.floor(Math.random() * choices.length)] || []
    return pick
}

export default function MultiCard({ products }: { products?: Product[] }) {
    const items = products && products.length ? products : defaultProducts
    const blocks = chunkArray(items, 5)

    return (
        <div className="space-y-6">
            {blocks.map((block, blockIdx) => {
                // container: single column on mobile, two columns on tablet (md), and custom 4x2 grid on lg+
                const containerCls = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-4'

                // For blocks shorter than 5, compute a random template of classes
                const randomTemplate = block.length < 5 ? getRandomPositionsForLessThanFive(block.length) : []

                return (
                    <div key={blockIdx} className={containerCls}>
                        {block.map((p, i) => {
                            const posCls = block.length === 5 ? getPositionClassesForFive(i) : (randomTemplate[i] || '')
                            const bg = i === 0 ? 'bg-[#D7F3E6]' : i === 1 ? 'bg-[#DDE8FB]' : i === 2 ? 'bg-[#E8F7FF]' : i === 3 ? 'bg-[#DDE8FB]' : 'bg-[#D7F3E6]'
                            const isFeatured = i === 0
                            const hasImageBelow = i === 2 && p.image
                            
                            return (
                                <article
                                    key={p.id}
                                    className={`rounded-lg p-4 lg:p-5 flex flex-col justify-between ${bg} ${posCls} ${isFeatured ? 'lg:flex-row lg:items-center lg:gap-4' : ''}`}
                                >
                                    {isFeatured ? (
                                        // Layout horizontal para el card destacado: imagen izquierda, texto derecha
                                        <>
                                            {p.image && (
                                                <div className="flex flex-shrink-0 justify-center items-center w-2/5 lg:w-2/5">
                                                    <img src={p.image} alt={p.title} className="w-full max-h-48 lg:max-h-56 object-contain" />
                                                </div>
                                            )}
                                            <div className="flex flex-col flex-1 justify-between min-h-0">
                                                <div>
                                                    <div className="mb-2">
                                                        <span className="bg-[#2B27AF] px-2 py-1 rounded font-medium text-white text-xs">65% de descuento</span>
                                                    </div>
                                                    {p.subtitle && <div className="mb-1 text-gray-600 text-sm">{p.subtitle}</div>}
                                                    <h3 className="mb-3 font-semibold text-[#2B27AF] text-xl lg:text-2xl">{p.title}</h3>
                                                </div>
                                                <div className="mt-auto">
                                                    <button className="bg-[#2B27AF] hover:bg-[#1f1c8a] px-4 py-2 rounded-full text-white text-sm lg:text-base transition-colors">Comprar</button>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        // Layout vertical para los otros cards
                                        <>
                                            <div className="flex flex-col flex-1">
                                                <div className="mb-2">
                                                    <span className="bg-[#2B27AF] px-2 py-1 rounded font-medium text-white text-xs">65% de descuento</span>
                                                </div>
                                                {p.subtitle && <div className="mb-1 text-gray-600 text-sm">{p.subtitle}</div>}
                                                <h3 className={`mb-3 font-semibold text-[#2B27AF] text-lg lg:text-xl ${hasImageBelow ? '' : 'mb-4'}`}>{p.title}</h3>
                                                {hasImageBelow && (
                                                    <div className="flex justify-center mb-3">
                                                        <img src={p.image} alt={p.title} className="w-full max-h-32 object-contain" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="mt-auto">
                                                <button className="bg-[#2B27AF] hover:bg-[#1f1c8a] px-4 py-2 rounded-full text-white text-sm lg:text-base transition-colors">Comprar</button>
                                            </div>
                                        </>
                                    )}
                                </article>
                            )
                        })}
                    </div>
                )
            })}
        </div>
    )
}
