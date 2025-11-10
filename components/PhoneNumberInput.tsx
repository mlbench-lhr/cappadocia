import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function PhoneNumberInput({
  phone,
  setPhone,
}: {
  phone: string;
  setPhone: any;
}) {
  return (
    <PhoneInput
      country={"tr"}
      value={phone}
      placeholder="Enter phone number"
      onChange={setPhone}
      inputClass="input-style-phone-number"
      buttonClass="!border-r !border-gray-300"
    />
  );
}
