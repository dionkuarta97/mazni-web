"use client";

import axios from "axios";
import { Data } from "./page";
import { useEffect, useState } from "react";
import {
   Select,
   Option,
   Button,
   Dialog,
   DialogHeader,
   DialogBody,
   DialogFooter,
   Input,
} from "@material-tailwind/react";
import Link from "next/link";

const getData = async (filter: {
   page: number;
   from: string | null;
   to: string | null;
   limit: number;
   search: string | undefined;
   orderBy: string | null;
   sort: string | undefined;
}): Promise<Data> => {
   try {
      const { data } = await axios(
         "https://api.keluargamazni.com/api/pendanaan",
         {
            method: "get",
            params: filter,
         }
      );

      return data;
   } catch (error) {
      console.log(error);

      throw error;
   }
};

const month = [
   "Januari",
   "Februari",
   "Maret",
   "April",
   "Mei",
   "Juni",
   "Juli",
   "Agustus",
   "September",
   "Oktober",
   "November",
   "Desember",
];

const Home = () => {
   const [filter, setFilter] = useState<{
      page: number;
      from: string | null;
      to: string | null;
      limit: number;
      search: string | undefined;
      orderBy: string | null;
      sort: string | undefined;
   }>({
      page: 1,
      from: null,
      to: null,
      limit: 10,
      search: "",
      orderBy: "id",
      sort: "DESC",
   });
   const [data, setData] = useState<Data["data"] | null>(null);
   const [loading, setLoading] = useState(true);
   const [totalSeluruh, setTotalSeluruh] = useState<number | null>(null);
   const [tahun, setTahun] = useState<number[]>([]);
   const [selectTahun, setSelectTahun] = useState<string | undefined>("");
   const [selectBulan, setSelectBulan] = useState<string | undefined>("");
   const [open, setOpen] = useState(false);
   const [search, setSearch] = useState<string | undefined>("");
   const [sort, setSort] = useState<string | undefined>("DESC");

   const handleOpen = () => setOpen(!open);
   useEffect(() => {
      const fetch = async () => {
         try {
            const { data, total_seluruh, min, max } = await getData(filter);

            setData(data);
            setTotalSeluruh(total_seluruh);
            let minYear = new Date(min);
            let maxYear = new Date(max);
            let loop =
               Number(maxYear.getFullYear()) - Number(minYear.getFullYear());
            let temp = [];
            for (let i = 0; i <= loop; i++) {
               temp.push(Number(minYear.getFullYear()) + i);
            }
            setTahun(temp);
            setLoading(false);
         } catch (error) {
            console.log(error);
         }
      };
      fetch();
   }, [filter]);

   return (
      <main className="flex flex-col items-center justify-between p-4 md:p-10">
         <Dialog
            open={open}
            handler={handleOpen}
            animate={{
               mount: { scale: 1, y: 0 },
               unmount: { scale: 0.9, y: -100 },
            }}
         >
            <DialogHeader>Filter</DialogHeader>
            <DialogBody
               className="h-96"
               divider
            >
               <Select
                  value={selectTahun}
                  onChange={(val) => setSelectTahun(val)}
                  label="Pilih Tahun"
               >
                  {tahun?.map((el, idx) => (
                     <Option
                        value={el.toString()}
                        key={idx}
                     >
                        {el}
                     </Option>
                  ))}
               </Select>

               <div className="my-4">
                  <Select
                     disabled={selectTahun === "" ? true : false}
                     value={selectBulan}
                     onChange={(val) => setSelectBulan(val)}
                     label="Pilih Bulan"
                  >
                     {month?.map((el, idx) => (
                        <Option
                           value={
                              idx < 9
                                 ? "0" + (idx + 1).toString()
                                 : (idx + 1).toString()
                           }
                           key={idx}
                        >
                           {el}
                        </Option>
                     ))}
                  </Select>
               </div>
               <div className="my-4">
                  <Select
                     value={sort}
                     onChange={(val) => setSort(val)}
                     label="Urut Berdasarkan"
                  >
                     <Option value={"ASC"}>Terlama</Option>
                     <Option value={"DESC"}>Terbaru</Option>
                  </Select>
               </div>
               <div className="my-4">
                  <Input
                     value={search}
                     onChange={(e) => {
                        setSearch(e.target.value);
                     }}
                     label="search by name"
                  />
               </div>
            </DialogBody>
            <DialogFooter>
               <Button
                  variant="text"
                  color="red"
                  onClick={handleOpen}
                  className="mr-1"
               >
                  <span>Cancel</span>
               </Button>
               <Button
                  variant="gradient"
                  color="green"
                  onClick={() => {
                     handleOpen();
                     if (selectBulan) {
                        let date = new Date(`${selectTahun}-${selectBulan}-01`);
                        let y = date.getFullYear();
                        let m = date.getMonth();
                        var firstDay = new Date(y, m, 1);
                        var lastDay = new Date(y, m + 1, 0);
                        console.log(`${selectTahun}-${selectBulan}-01`);

                        setFilter({
                           ...filter,
                           from: firstDay.toLocaleString("en-CA", {
                              year: "numeric",
                              month: "numeric",
                              day: "numeric",
                           }),
                           to: lastDay.toLocaleString("en-CA", {
                              year: "numeric",
                              month: "numeric",
                              day: "numeric",
                           }),
                           search: search,
                           sort: sort,
                        });
                     } else if (selectTahun) {
                        let date = new Date(`${selectTahun}-01-01`);
                        let y = date.getFullYear();
                        let m = date.getMonth();
                        var firstDay = new Date(y, 0, 1);
                        var lastDay = new Date(y + 1, 0, 0);

                        setFilter({
                           ...filter,
                           from: firstDay.toLocaleString("en-CA"),
                           to: lastDay.toLocaleString("en-CA", {
                              year: "numeric",
                              month: "numeric",
                              day: "numeric",
                           }),
                           search: search,
                           sort: sort,
                        });
                     } else {
                        setFilter({
                           ...filter,
                           search: search,
                           sort: sort,
                        });
                     }
                  }}
               >
                  <span>Confirm</span>
               </Button>
            </DialogFooter>
         </Dialog>
         <div className="flex-col min-h-screen  bg-white rounded-md drop-shadow-sm overflow-y-auto w-full  md:w-6/12 border-1 p-4 md:p-6">
            <div className="text-lg text-center">
               Dana Infak Keluarga Besar Mazni Mustafa
            </div>
            <div className="flex mt-4  flex-row">
               <div className="w-5/12">Dana Masuk</div>
               <div className="w-2/12">:</div>
               <div className="text-end w-5/12">
                  Rp. {totalSeluruh?.toLocaleString("id-ID")}
               </div>
            </div>
            <div className="flex mt-2   flex-row">
               <div className="w-5/12">Jumlah Donatur</div>
               <div className="w-2/12">:</div>
               <div className="text-end w-5/12">{data?.total}</div>
            </div>
            <div className="flex  p-4 flex-row">
               <Button
                  size="sm"
                  onClick={handleOpen}
                  className="w-5/12"
               >
                  Filter
               </Button>
               <Button
                  color="amber"
                  size="sm"
                  onClick={() => {
                     setSelectTahun("");
                     setSelectBulan("");
                     setSort("");
                     setSearch("");
                     setFilter({
                        page: 1,
                        from: null,
                        to: null,
                        limit: 10,
                        search: "",
                        orderBy: "id",
                        sort: "DESC",
                     });
                  }}
                  className="ms-auto w-5/12"
               >
                  Reset Filter
               </Button>
            </div>
            {loading && <h1>loading</h1>}
            <div className="min-h-screen">
               {data?.data.map((el, idx) => (
                  <div
                     className="flex-1  text-sm md:text-md flex-col mb-4 border-2  p-2 rounded"
                     key={idx}
                  >
                     <div className="flex h-full flex-row">
                        <div className="me-4 self-center w-1/12">
                           {idx + 1 + (filter.page - 1) * filter.limit}
                        </div>
                        <div className="flex-col  flex-1 w-10/12">
                           <div className="">{el.nama}</div>
                           <div className="flex  my-2 items-end flex-row">
                              <div className="bg-green-500 p-1 rounded-md text-gray-100">
                                 Rp. {Number(el.infak).toLocaleString("id-ID")}
                              </div>
                              <div className="ms-auto text-gray-600">
                                 {new Date(el.tanggal).toLocaleDateString(
                                    "id-ID",
                                    {
                                       day: "2-digit",
                                       month: "long",
                                       year: "numeric",
                                    }
                                 )}
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
            <div className="flex-row flex-wrap justify-center items-center flex gap-2 items-center bg-white rounded-md drop-shadow-sm w-full mt-4 md:w-full border-1 p-4 md:p-6">
               {data?.links.map((el, idx) => (
                  <button
                     className={`${el.active ? "bg-blue-200" : "bg-gray-300"} ${
                        Number(el.label) ? "w-8 py-1" : "p-1"
                     } rounded `}
                     onClick={() => {
                        if (el.url !== null) {
                           window.scrollTo({ top: 0, behavior: "smooth" });
                           setFilter({
                              ...filter,
                              page: Number(el.label)
                                 ? Number(el.label)
                                 : idx === 0
                                 ? filter.page - 1
                                 : filter.page + 1,
                           });
                        }
                     }}
                     key={idx}
                  >
                     {Number(el.label)
                        ? el.label
                        : idx === 0
                        ? el.label?.split(" ")[1]
                        : el.label?.split(" ")[0]}
                  </button>
               ))}
            </div>
            <div className="my-4">
               <Select
                  value={filter.limit.toString()}
                  onChange={(val) =>
                     setFilter({ ...filter, limit: Number(val) })
                  }
                  label="Jumlah data yg di tampilkan"
               >
                  <Option value={"10"}>10</Option>
                  <Option value={"20"}>20</Option>
                  <Option value={"50"}>50</Option>
                  <Option value={"100"}>100</Option>
               </Select>
            </div>
            <Link
               className="my-4 self-center"
               href={"/login"}
            >
               Login
            </Link>
         </div>
         <button
            onClick={() => {
               window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="fixed bottom-2 right-2 items-center rounded-full p-2 bg-green-300"
         >
            <svg
               width="30"
               height="30"
               viewBox="0 0 30 30"
               fill="none"
               xmlns="http://www.w3.org/2000/svg"
            >
               <path
                  d="M18.221,7.206l9.585,9.585c0.879,0.879,0.879,2.317,0,3.195l-0.8,0.801c-0.877,0.878-2.316,0.878-3.194,0  l-7.315-7.315l-7.315,7.315c-0.878,0.878-2.317,0.878-3.194,0l-0.8-0.801c-0.879-0.878-0.879-2.316,0-3.195l9.587-9.585  c0.471-0.472,1.103-0.682,1.723-0.647C17.115,6.524,17.748,6.734,18.221,7.206z"
                  fill="#515151"
               />
            </svg>
         </button>
      </main>
   );
};

export default Home;
