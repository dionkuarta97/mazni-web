import {
   Button,
   Dialog,
   DialogBody,
   DialogFooter,
   DialogHeader,
   Input,
   Textarea,
} from "@material-tailwind/react";
import { useState } from "react";
import DatePicker from "react-datepicker";
import CurrencyInput from "react-currency-input-field";

import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

type Props = {
   open: boolean;
   handleOpen: () => void;
   onConfrim: () => void;
   id: number;
};

type Value = {
   startDate: Date | null;
   endDate: Date | null;
};

const deletePendanaan = async ({
   id,
   token,
}: {
   id: number;
   token: string;
}) => {
   try {
      const { data } = await axios(
         "https://api.keluargamazni.com/api/pendanaan/" + id,
         {
            method: "delete",
            headers: {
               access_token: token,
            },
         }
      );
      return data;
   } catch (error) {
      throw error;
   }
};

const ModalDelete = ({ id, onConfrim, open, handleOpen }: Props) => {
   return (
      <Dialog
         open={open}
         handler={handleOpen}
         animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0.9, y: -100 },
         }}
      >
         <DialogHeader>Hapus Data</DialogHeader>
         <DialogBody divider>
            <h1>apakah yakin untuk mengahapus data?</h1>
         </DialogBody>
         <DialogFooter>
            <Button
               variant="text"
               color="red"
               onClick={() => {
                  handleOpen();
               }}
               className="mr-1"
            >
               <span>Tidak</span>
            </Button>
            <Button
               variant="gradient"
               color="green"
               onClick={async () => {
                  let tkn = window.localStorage.getItem("access_token");
                  if (tkn) {
                     const data = await deletePendanaan({
                        id,
                        token: tkn,
                     });
                  }

                  handleOpen();
                  onConfrim();
               }}
            >
               <span>Yakin</span>
            </Button>
         </DialogFooter>
      </Dialog>
   );
};

export default ModalDelete;
