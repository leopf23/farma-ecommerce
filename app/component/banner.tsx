interface BannerProps {
  imageUrl: string;
  width?: string;
  height?: string;
}

export default function Banner({ imageUrl, width = "w-full", height = "h-96" }: BannerProps) {
  return (
    <div className={`bg-cover bg-no-repeat bg-center rounded-lg ${width} ${height} overflow-hidden`}
         style={{ backgroundImage: `url(${imageUrl})` }}>
    </div>
  )
}
