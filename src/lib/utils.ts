import { Client } from "@/payload/payload-types";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { deaccent } from "@/lib/accent-insensitive"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function formatDocument(input: string): {
  cpf: string;
  cnpj: string;
} {
  const len = input.length
  // console.log('toaq')

  // // Ensure length is between 3 and 14
  if (len < 3 || len > 14) {
    // console.log('toaq2')

    return { cpf: '', cnpj: '' };
  }

  // console.log('toaq3')



  // Pad with zeros to ensure 11 digits for CPF and 14 for CNPJ
  const paddedForCPF = input.padEnd(11, '0');
  const paddedForCNPJ = input.padEnd(14, '0');

  // Format as CPF
  const cpfFull = `${paddedForCPF.slice(0, 3)}.${paddedForCPF.slice(3, 6)}.${paddedForCPF.slice(6, 9)}-${paddedForCPF.slice(9, 11)}`;
  const cpf = cpfFull.slice(0, len);

  // Format as CNPJ
  const cnpjFull = `${paddedForCNPJ.slice(0, 2)}.${paddedForCNPJ.slice(2, 5)}.${paddedForCNPJ.slice(5, 8)}/${paddedForCNPJ.slice(8, 12)}-${paddedForCNPJ.slice(12, 14)}`;
  const cnpj = cnpjFull.slice(0, len);

  return { cpf, cnpj };
}

export function filterClients(
  clients: Client[],
  query: string | undefined | null
): Client[] {
  if (!query) return clients;

  const cleanQuery = deaccent(query).replace(/[^0-9a-z ]/g, '');
  if (cleanQuery.length <= 3) return clients;

  return clients.filter(client => {
    const doc = deaccent(client.document ?? '');
    const razao = deaccent(client.razaosocial ?? '');
    const name = deaccent(client.name ?? '');

    return (
      doc.includes(cleanQuery) ||
      razao.includes(cleanQuery) ||
      name.includes(cleanQuery)
    );
  });
}
