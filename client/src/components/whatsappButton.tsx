import { Link } from "react-router-dom";

export default function WhatsAppButton() {
    const phoneNumber = "7535005331";
    const whatsappUrl = `https://wa.me/${phoneNumber}`;

    return (
        <Link
            to={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
        >
            Chat on WhatsApp
        </Link>
    );
};

