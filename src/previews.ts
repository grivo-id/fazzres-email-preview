import type { EmailContent } from "./email";

export type PreviewCategory = "Account" | "Billing" | "Notifications" | "Customer";
export type EmailPreview = {
  id: string;
  name: string;
  category: PreviewCategory;
  language: "English" | "Bahasa Indonesia";
  from: string;
  to: string;
  subject: string;
  content: EmailContent;
};

const support = '"FazzRes" <support@fazzres.com>';

export const previews: EmailPreview[] = [
  {
    id: "otp",
    name: "Registration code",
    category: "Account",
    language: "English",
    from: support,
    to: "Rina Putri <rina@northstar.id>",
    subject: "Your registration code",
    content: {
      preheader: "Your verification code for registration",
      title: "Your registration code",
      greeting: "Hello,",
      paragraphs: ["Use the code below to complete your registration. It expires in 10 minutes.", "For your security, do not share this code with anyone."],
      code: "482913",
      note: "If you did not request this code, you can safely ignore this email.",
      signoff: "Regards,\nFazzRes Support Team",
    },
  },
  {
    id: "password-reset",
    name: "Password reset",
    category: "Account",
    language: "English",
    from: support,
    to: "Rina Putri <rina@northstar.id>",
    subject: "Reset your FazzRes account password",
    content: {
      preheader: "Use the secure link to reset your FazzRes password",
      title: "Reset your password",
      greeting: "Hello,",
      paragraphs: ["We received a request to reset the password for your FazzRes account.", "This secure link expires in 10 minutes."],
      action: { label: "Reset password", url: "https://app.fazzres.com/reset-password?token=preview-only-token" },
      note: "If you did not request a password reset, you can safely ignore this email. Your password will not change unless you use the link above.",
      signoff: "Regards,\nFazzRes Support Team",
    },
  },
  {
    id: "renewal",
    name: "Subscription renewal",
    category: "Billing",
    language: "Bahasa Indonesia",
    from: support,
    to: "Rina Putri <rina@northstar.id>",
    subject: "Perpanjangan Growth menunggu pembayaran",
    content: {
      lang: "id",
      preheader: "Invoice perpanjangan paket Growth Anda sudah tersedia.",
      title: "Perpanjangan Growth menunggu pembayaran",
      greeting: "Halo Rina,",
      paragraphs: ["Saldo Wallet Anda belum cukup untuk memperpanjang langganan Growth. Silakan selesaikan pembayaran sebelum periode berakhir."],
      details: [
        { label: "Paket", value: "Growth" },
        { label: "Total", value: "Rp 499.000" },
        { label: "Periode", value: "6 November 2026 - 6 Desember 2026" },
      ],
      action: { label: "Bayar sekarang", url: "https://app.fazzres.com/invoice/preview-invoice" },
      note: "Jika pembayaran belum diterima sebelum periode berakhir, akun Anda akan turun ke paket Free.",
      signoff: "Salam hangat,\nTim FazzRes",
    },
  },
  {
    id: "payment-paid",
    name: "Payment received",
    category: "Notifications",
    language: "English",
    from: support,
    to: "Rina Putri <rina@northstar.id>",
    subject: "Payment received",
    content: {
      preheader: "Your payment for invoice INV-2026-00418 has been received.",
      title: "Payment received",
      greeting: "Hello Rina,",
      paragraphs: ["Your payment for invoice INV-2026-00418 has been received."],
      action: { label: "Open in FazzRes", url: "https://app.fazzres.com/settings/billing" },
      signoff: "Regards,\nFazzRes Support Team",
    },
  },
  {
    id: "payment-failed",
    name: "Payment needs attention",
    category: "Notifications",
    language: "English",
    from: support,
    to: "Rina Putri <rina@northstar.id>",
    subject: "Payment needs attention",
    content: {
      preheader: "Payment for invoice INV-2026-00421 expired.",
      title: "Payment needs attention",
      greeting: "Hello Rina,",
      paragraphs: ["Payment for invoice INV-2026-00421 expired. Review the invoice and try again if needed."],
      action: { label: "Open in FazzRes", url: "https://app.fazzres.com/settings/billing" },
      signoff: "Regards,\nFazzRes Support Team",
    },
  },
  {
    id: "broadcast",
    name: "Product announcement",
    category: "Notifications",
    language: "English",
    from: support,
    to: "Rina Putri <rina@northstar.id>",
    subject: "Introducing smarter team inboxes",
    content: {
      preheader: "A new update for your FazzRes workspace.",
      title: "Introducing smarter team inboxes",
      greeting: "Hello Rina,",
      paragraphs: ["Your team can now assign conversations directly from the inbox and see who is handling each customer. The update is available in your workspace today."],
      action: { label: "Open in FazzRes", url: "https://app.fazzres.com/inbox" },
      signoff: "Regards,\nFazzRes Support Team",
    },
  },
  {
    id: "customer-receipt",
    name: "Customer payment receipt",
    category: "Customer",
    language: "Bahasa Indonesia",
    from: support,
    to: "Siti Aminah <siti.aminah@example.id>",
    subject: "Payment received - INV-BS-2026-0084",
    content: {
      lang: "id",
      showPreheader: false,
      footerLabel: "Bantuan",
      textFooterYear: false,
      preheader: "Pembayaran invoice INV-BS-2026-0084 telah kami terima.",
      title: "Konfirmasi pembayaran",
      textTitle: "Konfirmasi pembayaran INV-BS-2026-0084",
      greeting: "Halo Siti Aminah,",
      paragraphs: ["Pembayaran untuk invoice INV-BS-2026-0084 sudah kami terima."],
      textParagraphs: ["Pembayaran untuk invoice INV-BS-2026-0084 sudah kami terima."],
      htmlParagraphs: ["Pembayaran untuk invoice <strong>INV-BS-2026-0084</strong> sudah kami terima. Terima kasih telah bertransaksi."],
      details: [
        { label: "Total pembayaran", textLabel: "Total", value: "Rp 275.000" },
        { label: "Metode pembayaran", value: "QRIS" },
      ],
      action: { label: "Lihat invoice", url: "https://invoice.fazzres.com/invoice/preview-invoice" },
      signoff: "Salam hangat,\nTim FazzRes",
    },
  },
];
