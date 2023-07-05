import { memo, useState } from "react";
import ModalDelete from "./modalDelete";
import card from "@material-tailwind/react/theme/components/card";
import ModalEdit from "./modalEdit";

const Card = ({ el, idx, filter, onConfrim }: any) => {
   const [openDelete, setOpenDelete] = useState(false);
   const [openEdit, setOpenEdit] = useState(false);
   return (
      <div className="flex-1  text-sm md:text-md flex-col mb-4 border-2  p-2 rounded">
         <ModalDelete
            open={openDelete}
            id={el.id}
            handleOpen={() => {
               setOpenDelete(false);
            }}
            onConfrim={() => {
               onConfrim();
            }}
         />
         <ModalEdit
            infa={el.infak}
            nam={el.nama}
            tangga={el.tanggal}
            open={openEdit}
            id={el.id}
            handleOpen={() => {
               setOpenEdit(false);
            }}
            onConfrim={() => {
               onConfrim();
            }}
         />
         <div className="flex  flex-row">
            <div className="me-4 self-center w-1/12">
               {idx + 1 + (filter.page - 1) * filter.limit}
            </div>
            <div className="flex-col  flex-1 w-10/12">
               <div className="">{el.nama}</div>
               <div className="flex my-2 items-end flex-row">
                  <div className="bg-green-500 p-1 rounded-md text-gray-100">
                     Rp. {Number(el.infak).toLocaleString("id-ID")}
                  </div>
                  <div className="ms-auto text-gray-600">
                     {new Date(el.tanggal).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                     })}
                  </div>
               </div>
               <div className="flex my-2 items-start justify-end flex-row">
                  <button
                     onClick={() => {
                        setOpenEdit(true);
                     }}
                     className="bg-amber-400 py-1 px-2 rounded"
                  >
                     edit
                  </button>
                  <button
                     onClick={() => {
                        setOpenDelete(true);
                     }}
                     className="ms-2 bg-red-400 text-white py-1 px-2 rounded"
                  >
                     delete
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Card;
