import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Label } from "@/components/ui/label";

export default function PhoneNumberInput() {
  const [phone, setPhone] = useState("");

  return (
    <div className="flex flex-col space-y-2">
      <Label>Phone Number</Label>
      <PhoneInput
        country={"tr"}
        value={phone}
        placeholder="Enter phone number"
        onChange={setPhone}
        inputClass="input-style-phone-number"
        buttonClass="!border-r !border-gray-300"
      />
    </div>
  );
}
