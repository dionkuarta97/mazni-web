import { Metadata, ResolvingMetadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
   // read route params

   // fetch data
   const metadata = await fetch(
      `https://api.keluargamazni.com/api/metadata`
   ).then((res) => res.json());

   // optionally access and extend (rather than replace) parent metadata

   return {
      title: "Keluarga Besar Mazni Mustafa",
      description: `Infak bulan ${metadata.bulan} adalah sebesar Rp. ${Number(
         metadata.total_bulan_ini
      ).toLocaleString("id-ID")}. Total keseluruhan adalah Rp. ${Number(
         metadata.total_keseluruhan
      ).toLocaleString("id-ID")}.`,
   };
}
export default function RootLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   return (
      <html lang="en">
         <body className={inter.className}>{children}</body>
      </html>
   );
}
