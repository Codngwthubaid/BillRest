import axios from "axios";

export const sendInvoiceViaWhatsApp = async (phoneNumber, pdfUrl) => {
  try {
    const apiUrl = "https://api.gupshup.io/sm/api/v1/msg";
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      "apikey": process.env.GUPSHUP_API_KEY,
    };

    const payload = new URLSearchParams({
      channel: "whatsapp",
      source: process.env.WHATSAPP_SOURCE_NUMBER,
      destination: phoneNumber,
      "src.name": process.env.GUPSHUP_APP_NAME,
      message: JSON.stringify({
        type: "file",
        url: pdfUrl,
        caption: "🧾 Here is your invoice. Thank you for shopping with us!",
      }),
    });

    const response = await axios.post(apiUrl, payload, { headers });
    return response.data;
  } catch (err) {
    console.error("WhatsApp send error:", err.response?.data || err.message);
    throw new Error("Failed to send WhatsApp message");
  }
};
