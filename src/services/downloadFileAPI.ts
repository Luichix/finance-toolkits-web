import type { AmortizationData } from "@interfaces/amortization";

class DownloadFileAPI {
  private static readonly baseURL = import.meta.env.PUBLIC_API_URL;

  private static headers = {
    "Content-Type": "application/json",
  };

  static async getAmortizationTableFileXLSX({
    amortization,
  }: {
    amortization: AmortizationData;
  }) {
    try {
      const response = await fetch(
        `${this.baseURL}/generate_amortization_table_xlsx`,
        {
          method: "POST",
          headers: this.headers,
          body: JSON.stringify(amortization),
        },
      );

      if (!response.ok) {
        throw new Error(`Fetch Error: ${response.statusText}`);
      }

      // Utiliza response.blob() para obtener el archivo binario
      const blob = await response.blob();

      // Luego puedes trabajar con 'blob', por ejemplo, para descargar el archivo
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "amortizacion-table.xlsx";
      a.click();
    } catch (error) {
      throw new Error(`Fetch Error: ${error}`);
    }
  }
}

export default DownloadFileAPI;
