// Ready-made coolers sold alongside the personalized IcedCar. Prices in centavos (card price = original price).
export type Product = { slug: string; name: string; liters: number; quarts: string; price: number; images: { src: string; srcSet: string }[]; summary: string };

const img = (a: string, b: string, c: string, d: string) => ({ src: `/site-assets/${c}.webp`, srcSet: `/site-assets/${a}.webp 400w, /site-assets/${b}.webp 800w, /site-assets/${c}.webp 1600w, /site-assets/${d}.jpg 3840w` });

export const PRODUCTS: Product[] = [
  { slug: "caixa-termica-marine-contour-de-150-qt", name: "Caixa Térmica Marine Contour de 142 litros", liters: 142, quarts: "150 qt", price: 14499, images: [img("ba1ab31545eb88da", "3e95186607cb2e87", "d7bdc37465f0006d", "279f4da61927fa49")], summary: "Caixa térmica grande, ideal para pesca, barco e viagens longas." },
  { slug: "caixa-termica-nfl-legacy-de-20-qt", name: "Caixa térmica NFL Legacy de 19 litros", liters: 19, quarts: "20 qt", price: 19999, images: [img("2895c5cf7aa80ed3", "49f82abf11880f08", "165099d112a22ac3", "831fe66b29cb100e")], summary: "Visual temático da NFL, tamanho prático para o dia a dia e jogos." },
  { slug: "caixa-termica-retro-picnic-basket-de-25-qt", name: "Caixa térmica Retro Picnic Basket de 24 litros", liters: 24, quarts: "25 qt", price: 6599, images: [img("a6bab716bccd33c6", "749108d313644210", "4914722cef2e621c", "524c277a8dfe4242")], summary: "Estilo cesta de piquenique retrô, perfeita para passeios e praia." },
  { slug: "caixa-termica-party-bar-de-125-qt", name: "Caixa térmica Party Bar de 118 litros", liters: 118, quarts: "125 qt", price: 27999, images: [img("1f23fea3237c63b5", "5599454458e4ebb6", "6e1dfd9879fde0bf", "aa032b640d266a2c")], summary: "Bar térmico em pé para festas e eventos, com bastante espaço." },
  { slug: "caixa-termica-tag-along-too-remix", name: "Caixa térmica Tag Along Too Remix", liters: 15, quarts: "16 qt", price: 5999, images: [img("eb0e3304397bf28b", "b95b53da88e740e2", "65743cbf9099cb11", "efea9fe6a85082a0")], summary: "Compacta e fácil de levar, ótima para lanches e bebidas individuais." },
  { slug: "caixa-termica-latitude-de-30-qt", name: "Caixa térmica Latitude de 28 litros", liters: 28, quarts: "30 qt", price: 4999, images: [img("5b7c349f722ea20f", "82e414c9c3cc7a2b", "9e50236c4b60ad4d", "5992bafc4e6b37d8")], summary: "Tamanho médio versátil para churrasco, praia e camping." },
  { slug: "caixa-termica-polar-de-120-qt", name: "Caixa térmica Polar de 114 litros", liters: 114, quarts: "120 qt", price: 12999, images: [img("112276509c8649ec", "5d4f5fd03bfe1a88", "1570458ae2415f83", "2df690d7fea59d4c")], summary: "Grande capacidade para grupos, viagens e eventos." },
  { slug: "caixa-termica-marine-de-25-qt", name: "Caixa térmica Marine de 24 litros", liters: 24, quarts: "25 qt", price: 4699, images: [img("e0104b3f8ce39299", "cc304c8be670f8d0", "e529793bd15e5cce", "be16826e0184c216")], summary: "Linha Marine em tamanho compacto, resistente para uso ao ar livre." },
];

export const productBySlug = (slug: string) => PRODUCTS.find((p) => p.slug === slug);
