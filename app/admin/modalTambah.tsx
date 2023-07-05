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
};

type Value = {
   startDate: Date | null;
   endDate: Date | null;
};

const addPendanaan = async ({
   nama,
   infak,
   tanggal,
   token,
}: {
   nama: string;
   infak: number;
   tanggal: string;
   token: string;
}) => {
   try {
      const { data } = await axios(
         "https://api.keluargamazni.com/api/pendanaan",
         {
            method: "post",
            headers: {
               access_token: token,
            },
            data: {
               nama,
               infak,
               tanggal,
            },
         }
      );
      return data;
   } catch (error) {
      throw error;
   }
};

const ModalTambah = ({ onConfrim, open, handleOpen }: Props) => {
   const [nama, setNama] = useState("");
   const [infak, setInfak] = useState<number | null>(null);
   const [startDate, setStartDate] = useState(null);
   const checkDisabled = () => {
      let temp = true;
      if (nama !== "" && infak !== null && startDate !== null) {
         temp = false;
      }
      return temp;
   };
   return (
      <Dialog
         open={open}
         handler={handleOpen}
         animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0.9, y: -100 },
         }}
      >
         <DialogHeader>Tambah Data</DialogHeader>
         <DialogBody divider>
            <div className="flex gap-6 flex-col">
               <Textarea
                  value={nama}
                  onChange={(e) => {
                     setNama(e.target.value);
                  }}
                  label="Nama"
               />
               <CurrencyInput
                  id="input-example"
                  name="input-name"
                  className="w-[100%] p-1 border-2 border-gray-400 rounded-md"
                  placeholder="Infak"
                  defaultValue={infak ? infak : 0}
                  prefix="Rp. "
                  groupSeparator="."
                  decimalSeparator=","
                  onValueChange={(value, name) => setInfak(Number(value))}
               />

               <DatePicker
                  placeholderText="pilih tanggal"
                  className="w-[100%] p-1 border-2 border-gray-400 rounded-md"
                  selected={startDate}
                  onChange={(date: any) => {
                     setStartDate(date);
                  }}
               />
            </div>
         </DialogBody>
         <DialogFooter>
            <Button
               variant="text"
               color="red"
               onClick={() => {
                  handleOpen();
                  setNama("");
                  setInfak(0);
                  setStartDate(null);
               }}
               className="mr-1"
            >
               <span>Cancel</span>
            </Button>
            <Button
               variant="gradient"
               disabled={checkDisabled()}
               color="green"
               onClick={async () => {
                  if (startDate) {
                     let tkn = window.localStorage.getItem("access_token");
                     if (tkn) {
                        const data = await addPendanaan({
                           nama,
                           infak: infak ? infak : 0,
                           tanggal: new Date(startDate).toLocaleDateString(
                              "en-CA"
                           ),
                           token: tkn,
                        });
                     }
                  }

                  setNama("");
                  setInfak(0);
                  setStartDate(null);
                  handleOpen();
                  onConfrim();
               }}
            >
               <span>Confirm</span>
            </Button>
         </DialogFooter>
      </Dialog>
   );
};

export default ModalTambah;
