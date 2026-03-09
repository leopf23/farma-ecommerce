export interface MappedProduct {
  id: string | number;
  image: string;
  category: string;
  title: string;
  price: string | number;
  porcentajeDescuento?: string | number;
  subtitle?: string;
  marca?: string;
}

export function mapProductToCard(p: any): MappedProduct {
  return {
    id: p.id ?? p.productoId,
    image: p.id === 1533 ? p.images[0] : "/producto2.png",
    category: p.nombreCategoria ?? p.categoria ?? p.category ?? "",
    title: p.nombre ?? "",
    price: p.precioVenta?.toFixed?.(2) ?? p.precio ?? p.price ?? "0.00",
    subtitle: p.descripcion ?? "",
    porcentajeDescuento: p.porcentajeDescuento ?? "",
    marca: p.marca ?? "",
  };
}
