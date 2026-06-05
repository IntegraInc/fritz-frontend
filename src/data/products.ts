import { Product } from "@/types/product";

export const products: Product[] = [
  {
    id: 101,
    description: "Fio de Cobre Flexível 2.5mm",
    mediaPonderada: 45.50,
    icms: 18,
    frete: 5,
    ipi: 0,
    pis: 1.65,
    cofins: 7.60,
    comissaoInterna: 2,
    comissaoExterna: 5,
    lucro: 25,
  },
  {
    id: 102,
    description: "Disjuntor Bipolar 40A",
    mediaPonderada: 32.10,
    icms: 18,
    frete: 3,
    ipi: 5,
    pis: 1.65,
    cofins: 7.60,
    comissaoInterna: 2,
    comissaoExterna: 5,
    lucro: 30,
  },
];