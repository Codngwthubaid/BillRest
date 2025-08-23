import {
    ChartColumn,
    FileText,
    Home,
    ShoppingBag,
    User,
    HelpCircle,
    Mail,
    IndianRupee,
    UserRoundCheck,
    StoreIcon,
    FileTerminal,
    SquareUserRound,
    ListOrdered,
    Receipt,
    Hospital,
    Bed
} from "lucide-react";

export const items = {
    sidebarOfCustomer: [
        {
            title: "Dashboard",
            href: "/",
            icon: Home,
        },
        {
            title: "Invoices",
            href: "/invoices",
            icon: FileText,
        },
        {
            title: "Products",
            href: "/products",
            icon: ShoppingBag,
        },
        {
            title: "Customers",
            href: "/customers",
            icon: UserRoundCheck,
        },
        {
            title: "Reports",
            href: "/reports",
            icon: ChartColumn,
        },
        {
            title: "Profile",
            href: "/profile",
            icon: User,
        },
        {
            title: "Contact",
            href: "/contact",
            icon: Mail,
        },
        {
            title: "Plans",
            href: "/plans",
            icon: IndianRupee,
        },
        {
            title: "Help",
            href: "/help",
            icon: HelpCircle,
        },
    ],
    sidebarOfHealthForHospital: [
        {
            title: "Dashboard",
            href: "/",
            icon: Home,
        },
        {
            title: "Appointments",
            href: "/appointments",
            icon: FileTerminal
        },
        {
            title: "Patients",
            href: "/patients",
            icon: SquareUserRound
        },
        {
            title: "Beds",
            href: "/bed",
            icon: Bed
        },
        {
            title: "Services",
            href: "/services",
            icon: ListOrdered
        },
        {
            title: "Billing",
            href: "/billings",
            icon: Receipt
        },
        {
            title: "Reports",
            href: "/reports",
            icon: ChartColumn,
        },
        {
            title: "Profile",
            href: "/profile",
            icon: User,
        },
        {
            title: "Contact",
            href: "/contact",
            icon: Mail,
        },
        {
            title: "Plans",
            href: "/plans",
            icon: IndianRupee,
        },
        {
            title: "Help",
            href: "/help",
            icon: HelpCircle,
        },
    ],
    sidebarOfHealthForClinic: [
        {
            title: "Dashboard",
            href: "/",
            icon: Home,
        },
        {
            title: "Appointments",
            href: "/appointments",
            icon: FileTerminal
        },
        {
            title: "Patients",
            href: "/patients",
            icon: SquareUserRound
        },
        {
            title: "Services",
            href: "/services",
            icon: ListOrdered
        },
        {
            title: "Billing",
            href: "/billings",
            icon: Receipt
        },
        {
            title: "Reports",
            href: "/reports",
            icon: ChartColumn,
        },
        {
            title: "Profile",
            href: "/profile",
            icon: User,
        },
        {
            title: "Contact",
            href: "/contact",
            icon: Mail,
        },
        {
            title: "Plans",
            href: "/plans",
            icon: IndianRupee,
        },
        {
            title: "Help",
            href: "/help",
            icon: HelpCircle,
        },
    ],
    sidebarOfSupport: [
        {
            title: "Dashboard",
            href: "/",
            icon: Home,
        },
        {
            title: "Invoices",
            href: "/invoices",
            icon: FileText,
        },
        {
            title: "Products",
            href: "/products",
            icon: ShoppingBag,
        },
        {
            title: "Customers",
            href: "/customers",
            icon: UserRoundCheck,
        },
        {
            title: "Businesses",
            href: "/businesses",
            icon: StoreIcon,
        },
        {
            title: "Clinics",
            href: "/clinics",
            icon: Hospital,
        },
        {
            title: "Appointments",
            href: "/appointments",
            icon: FileTerminal,
        },
        {
            title: "Patients",
            href: "/patients",
            icon: SquareUserRound,
        },
        {
            title: "Services",
            href: "/services",
            icon: ListOrdered,
        },
        {
            title: "Billings",
            href: "/billings",
            icon: Receipt,
        },
        {
            title: "Contact",
            href: "/contact",
            icon: Mail,
        },
        {
            title: "Profile",
            href: "/profile",
            icon: User,
        },
        {
            title: "Help",
            href: "/help",
            icon: HelpCircle,
        },
    ],
    sidebarOfAdmin: [
        {
            title: "Dashboard",
            href: "/",
            icon: Home,
        },
        {
            title: "Businesses",
            href: "/business",
            icon: StoreIcon,
        },
        {
            title: "Invoices",
            href: "/invoices",
            icon: FileText,
        },
        {
            title: "Products",
            href: "/products",
            icon: ShoppingBag,
        },
        {
            title: "Customers",
            href: "/customers",
            icon: UserRoundCheck,
        },
        {
            title: "Clinics",
            href: "/clinics",
            icon: Hospital,
        },
        {
            title: "Appointments",
            href: "/appointments",
            icon: FileTerminal,
        },
        {
            title: "Patients",
            href: "/patients",
            icon: SquareUserRound,
        },
        {
            title: "Services",
            href: "/services",
            icon: ListOrdered,
        },
        {
            title: "Billings",
            href: "/billings",
            icon: Receipt,
        },
        {
            title: "Profile",
            href: "/profile",
            icon: User,
        },
        {
            title: "Contact",
            href: "/contact",
            icon: Mail,
        },
        {
            title: "Help",
            href: "/help",
            icon: HelpCircle,
        },
    ]
};
export const shortcuts = [
    {
        section: '🧾 Invoice/Billing Page Shortcuts',
        keys: [
            ['Ctrl + N', 'Start new invoice'],
            ['Ctrl + P', 'Print current invoice'],
            ['Ctrl + S', 'Save invoice (draft or final)'],
            ['Ctrl + Shift + W', 'Send invoice via WhatsApp'],
            ['Esc', 'Cancel invoice / Close popup'],
            ['Ctrl + B', 'Focus barcode input'],
            ['Ctrl + F', 'Focus product search field'],
            ['Enter (in search/barcode field)', 'Add item to invoice'],
            ['Ctrl + D', 'Apply discount field (if applicable)'],
            ['Ctrl + T', 'Toggle GST ON/OFF (by default ON)'],
        ],
    },
    {
        section: '🛒 Product Management Screen',
        keys: [
            ['Ctrl + A', 'Add new product'],
            ['Ctrl + E', 'Edit selected product'],
            ['Del or Backspace', 'Delete selected product (with confirmation)'],
            ['Ctrl + U', 'Upload product image'],
            ['Ctrl + Q', 'Quick barcode entry mode (for multiple products)'],
        ],
    },
    {
        section: '📊 Reports Page',
        keys: [
            ['Ctrl + R', 'Refresh report'],
            ['Ctrl + E', 'Export report as PDF'],
            ['Ctrl + H', 'Show top-selling items'],
        ],
    },
    {
        section: '⚙ Global Shortcuts',
        keys: [
            ['Ctrl + Shift + L', 'Logout'],
            ['Ctrl + Shift + A', 'Open Admin panel (if user has access)'],
            ['Ctrl + K', 'Open keyboard shortcut cheat-sheet (help popup)'],
            ['Ctrl + M', 'Go to Main Dashboard'],
            ['Ctrl + Shift + ?', 'Contact Support or trigger support popup'],
        ],
    },
];