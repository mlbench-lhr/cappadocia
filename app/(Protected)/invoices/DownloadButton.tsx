import { Button } from "@/components/ui/button";
import InvoicePDF from "./print/page";
import { Download } from "lucide-react";
import { InvoicePopulated } from "@/lib/types/invoices";
import { useState } from "react";
import axios from "axios";

export default function DownloadInvoiceButton({
  data,
  bookingId,
}: {
  data?: InvoicePopulated;
  bookingId?: string;
}) {
  const [loading, setLoading] = useState<boolean>(false);

  const getDataAndDownload = async () => {
    try {
      setLoading(true);
      let response = await axios.get(
        `/api/invoices/detailWithBookingId/${bookingId}`
      );
      console.log("response----", response.data);

      if (response.data) {
        const dataFromDb: InvoicePopulated = response.data;
        handleDownload(dataFromDb);
      }
      setLoading(false);
    } catch (error) {
      console.log("err---", error);
    }
  };

  const handleDownload = async (dataFromDb?: InvoicePopulated) => {
    const { pdf } = await import("@react-pdf/renderer");
    try {
      const blob = await pdf(
        <InvoicePDF data={bookingId ? dataFromDb : data} />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Invoice.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <Button
      variant={"main_green_button"}
      onClick={() => {
        bookingId ? getDataAndDownload() : handleDownload();
      }}
      loading={loading}
      loadingText="Downloading Invoice..."
    >
      <div className="flex justify-start items-center gap-2">
        Download Invoice
        <Download />
      </div>
    </Button>
  );
}
