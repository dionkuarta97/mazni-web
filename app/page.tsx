import Home from "./home";

import axios from "axios";

export type Data = {
   data: {
      current_page: number;
      data: {
         id: number;
         tanggal: string;
         infak: number;
         nama: string;
         created_at: string | null;
         updated_at: string | null;
      }[];
      first_page_url: string;
      from: number;
      last_page: number;
      last_page_url: string;
      links: {
         url: string | null;
         label: string | null;
         active: boolean;
      }[];
      next_page_url: string | null;
      path: string;
      per_page: number;
      prev_page_url: string | null;
      to: number;
      total: number;
   };
   total_seluruh: number;
   min: string;
   max: string;
};

export default async function Page() {
   return <Home />;
}
