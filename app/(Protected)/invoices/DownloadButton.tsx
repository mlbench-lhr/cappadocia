import { Button } from "@/components/ui/button";
import InvoicePDF from "./print/page";
import { Download } from "lucide-react";
import { InvoicePopulated } from "@/lib/types/invoices";

export default function DownloadInvoiceButton({
  data,
}: {
  data?: InvoicePopulated;
}) {
  const handleDownload = async () => {
    const { pdf } = await import("@react-pdf/renderer");
    try {
      const blob = await pdf(<InvoicePDF data={data} />).toBlob();
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
    <Button variant={"main_green_button"} onClick={handleDownload}>
      <div className="flex justify-start items-center gap-2">
        Download Invoice
        <Download />
      </div>
    </Button>
  );
}
