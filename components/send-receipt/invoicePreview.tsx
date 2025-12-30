import { InvoiceItem } from "@/lib/schemas/receiptSchema";
import Image from "next/image";

interface InvoicePreviewProps {
  customerName?: string;
  plate: string;
  items: InvoiceItem[];
  translations: {
    preview: string;
    invoice: string;
    customer: string;
    plate: string;
    service: string;
    price: string;
    subtotal: string;
    vat: string;
    total: string;
    noItems: string;
    thankYou: string;
    footer: string;
  };
}

export default function InvoicePreview({
  customerName,
  plate,
  items,
  translations: t,
}: InvoicePreviewProps) {
  const validItems = items.filter((item) => item.service && item.price);
  const total = validItems.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
  const vatRate = 0.255;
  const vatAmount = total * (vatRate / (1 + vatRate));
  const subtotal = total - vatAmount;

  const currentDate = new Date().toLocaleDateString("fi-FI", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="h-fit sticky top-8">
      {/* Preview Label */}
      <div className="text-sm font-medium text-gray-500 mb-3">{t.preview}</div>

      {/* Email Container - matches Receipt.tsx styling */}
      <div
        style={{
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          backgroundColor: "#f5f5f5",
          padding: "24px 16px",
        }}
      >
        <div
          style={{
            maxWidth: "560px",
            margin: "0 auto",
            backgroundColor: "#ffffff",
            border: "1px solid #e0e0e0",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "24px 32px",
              borderBottom: "1px solid #e0e0e0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Image
              src="/logo-opus.png"
              alt="AutoSpa Opus"
              width={80}
              height={40}
              style={{ objectFit: "contain" }}
            />
            <div style={{ textAlign: "right" }}>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#333333",
                  margin: "0 0 4px 0",
                }}
              >
                {t.invoice}
              </h3>
              <p
                style={{
                  fontSize: "12px",
                  color: "#666666",
                  margin: 0,
                }}
              >
                {currentDate}
              </p>
            </div>
          </div>

          {/* Customer Details */}
          <div style={{ padding: "20px 32px" }}>
            {/* Customer Info Box */}
            <div
              style={{
                backgroundColor: "#fafafa",
                padding: "14px 16px",
                marginBottom: "20px",
              }}
            >
              {customerName && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "6px",
                  }}
                >
                  <span style={{ fontSize: "12px", color: "#666666" }}>{t.customer}</span>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: "500",
                      color: "#333333",
                    }}
                  >
                    {customerName}
                  </span>
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ fontSize: "12px", color: "#666666" }}>{t.plate}</span>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: "500",
                    color: "#333333",
                  }}
                >
                  {plate || "—"}
                </span>
              </div>
            </div>

            {/* Services Table */}
            <div style={{ marginBottom: "20px" }}>
              {/* Table Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderBottom: "2px solid #333333",
                  paddingBottom: "6px",
                  marginBottom: "8px",
                }}
              >
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    color: "#333333",
                  }}
                >
                  {t.service}
                </span>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    color: "#333333",
                  }}
                >
                  {t.price}
                </span>
              </div>

              {/* Table Rows */}
              {validItems.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "24px 0",
                    color: "#999999",
                    fontSize: "13px",
                  }}
                >
                  {t.noItems}
                </div>
              ) : (
                validItems.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      borderBottom: "1px solid #e0e0e0",
                      padding: "10px 0",
                    }}
                  >
                    <span style={{ fontSize: "13px", color: "#333333" }}>{item.service}</span>
                    <span style={{ fontSize: "13px", color: "#333333" }}>
                      €{parseFloat(item.price).toFixed(2)}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Totals */}
            {validItems.length > 0 && (
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "4px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#666666",
                      marginLeft: "auto",
                      marginRight: "40px",
                    }}
                  >
                    {t.subtotal}
                  </span>
                  <span style={{ fontSize: "12px", color: "#666666" }}>€{subtotal.toFixed(2)}</span>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#666666",
                      marginLeft: "auto",
                      marginRight: "40px",
                    }}
                  >
                    {t.vat} (25.5%)
                  </span>
                  <span style={{ fontSize: "12px", color: "#666666" }}>
                    €{vatAmount.toFixed(2)}
                  </span>
                </div>

                <div
                  style={{
                    borderTop: "1px solid #333333",
                    paddingTop: "8px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#333333",
                      marginLeft: "auto",
                      marginRight: "40px",
                    }}
                  >
                    {t.total}
                  </span>
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#333333",
                    }}
                  >
                    €{total.toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              padding: "20px 32px",
              borderTop: "1px solid #e0e0e0",
              backgroundColor: "#fafafa",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontSize: "12px",
                color: "#666666",
                margin: "0 0 4px 0",
              }}
            >
              {t.thankYou}
            </p>
            <p
              style={{
                fontSize: "11px",
                color: "#999999",
                margin: 0,
              }}
            >
              {t.footer}
            </p>
          </div>

          {/* Copyright */}
          <div
            style={{
              padding: "14px 32px",
              borderTop: "1px solid #e0e0e0",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontSize: "10px",
                color: "#999999",
                margin: 0,
              }}
            >
              © {new Date().getFullYear()} AutoSpa Opus. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
