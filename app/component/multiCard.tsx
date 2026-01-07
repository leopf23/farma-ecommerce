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
    { id: 1, title: 'Multi-vitamins', subtitle: 'Gloryfeel · Cap 450', image: '/product1.png' },
    { id: 2, title: 'Winasorb Infantil', subtitle: 'Jarabe. Abbot, 60ml', image: '/product2.png' },
    { id: 3, title: 'Rangel Complejo B', subtitle: 'Suplemento vitaminico', image: '/product3.png' },
    { id: 4, title: 'Winasorb Infantil', subtitle: 'Jarabe. Abbot, 60ml', image: '/product2.png' },
    { id: 5, title: 'Winasorb Infantil', subtitle: 'Jarabe. Abbot, 60ml', image: '/product2.png' },
    // Example entry without image to demonstrate "clean" layout
    // { id: 6, title: 'Sin imagen - Solo texto', subtitle: 'Producto sin imagen de ejemplo' },
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
                            const bg = i === 0 ? 'bg-[#D7F3E6]' : i === 2 ? 'bg-[#DDE8FB]' : 'bg-[#E8F7FF]'

                            return (
                                <article
                                    key={p.id}
                                    className={`rounded-lg p-6 flex flex-col justify-between ${bg}  ${posCls}`}
                                >
                                    <div>
                                        {/* If image exists render it, otherwise render a clean layout without placeholder */}
                                        {p.image && (
                                            // image files should be placed in /public for Next.js
                                            <img src={p.image} alt={p.title} className="mb-4 w-full max-h-40 object-contain" />
                                        )}
                                        {p.subtitle && <div className="mb-1 text-gray-600 text-sm">{p.subtitle}</div>}
                                        <h3 className="mb-4 font-semibold text-[#2B27AF] text-2xl">{p.title}</h3>
                                    </div>

                                    <div className="mt-4">
                                        <button className="bg-[#2B27AF] px-4 py-2 rounded-full text-white">Comprar</button>
                                    </div>
                                </article>
                            )
                        })}
                    </div>
                )
            })}
        </div>
    )
}
