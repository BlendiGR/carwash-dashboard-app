import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Img,
  Section,
  Row,
  Column,
  Hr,
  Preview,
} from "@react-email/components";

export type ReceiptEmailTranslations = {
  preview: string;
  invoice: string;
  greeting: string;
  description: string;
  customer: string;
  plate: string;
  service: string;
  price: string;
  subtotal: string;
  vat: string;
  total: string;
  thankYou: string;
  footer: string;
  copyright: string;
};

export type ReceiptItem = {
  id: string;
  service: string;
  price: string;
};

export type ReceiptEmailProps = {
  customerName?: string;
  plate: string;
  items: ReceiptItem[];
  translations?: ReceiptEmailTranslations;
};

/** Default English translations */
const defaultTranslations: ReceiptEmailTranslations = {
  preview: "Your receipt from AutoSpa Opus",
  invoice: "Receipt",
  greeting: "Thank you for your visit!",
  description: "Here's a summary of the services provided for your vehicle.",
  customer: "Customer",
  plate: "License Plate",
  service: "Service",
  price: "Price",
  subtotal: "Subtotal",
  vat: "VAT",
  total: "Total",
  thankYou: "Thank you for choosing AutoSpa Opus!",
  footer: "We look forward to serving you again.",
  copyright: "All rights reserved.",
};

const Receipt = ({
  customerName,
  plate,
  items,
  translations = defaultTranslations,
}: ReceiptEmailProps) => {
  const t = translations;

  // Calculate totals
  const validItems = items.filter((item) => item.service && item.price);
  const total = validItems.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
  const vatRate = 0.255;
  const vatAmount = total * (vatRate / (1 + vatRate));
  const subtotal = total - vatAmount;

  return (
    <Html>
      <Head>
        <meta name="color-scheme" content="light only" />
        <meta name="supported-color-schemes" content="light only" />
      </Head>
      <Preview>
        {t.preview} - {plate}
      </Preview>
      <Body
        style={{
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          margin: 0,
          padding: "40px 20px",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Container
          style={{
            maxWidth: "560px",
            margin: "0 auto",
            backgroundColor: "#ffffff",
            border: "1px solid #e0e0e0",
          }}
        >
          {/* Header */}
          <Section
            style={{
              padding: "32px 40px",
              borderBottom: "1px solid #e0e0e0",
            }}
          >
            <Row>
              <Column style={{ width: "50%" }}>
                <Img
                  src="https://raw.githubusercontent.com/BlendiGR/autospa-opus/refs/heads/main/public/logo-opus.png?token=GHSAT0AAAAAADPB2SKD4SQRNUY6C5SHUBRA2KQCFJQ"
                  alt="AutoSpa Opus"
                  width="100"
                />
              </Column>
              <Column style={{ width: "50%", textAlign: "right" }}>
                <Heading
                  style={{
                    fontSize: "20px",
                    fontWeight: "600",
                    color: "#333333",
                    margin: "0 0 4px 0",
                  }}
                >
                  {t.invoice}
                </Heading>
                <Text
                  style={{
                    fontSize: "13px",
                    color: "#666666",
                    margin: 0,
                  }}
                >
                  {new Date().toLocaleDateString("fi-FI", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Text>
              </Column>
            </Row>
          </Section>

          {/* Customer Details */}
          <Section style={{ padding: "24px 40px" }}>
            <Text
              style={{
                fontSize: "14px",
                color: "#333333",
                margin: "0 0 16px 0",
                lineHeight: "22px",
              }}
            >
              {t.greeting}
              <br />
              {t.description}
            </Text>

            <Section
              style={{
                backgroundColor: "#fafafa",
                padding: "16px 20px",
                marginBottom: "24px",
              }}
            >
              {customerName && (
                <Row style={{ marginBottom: "8px" }}>
                  <Column style={{ width: "40%" }}>
                    <Text
                      style={{
                        fontSize: "13px",
                        color: "#666666",
                        margin: 0,
                      }}
                    >
                      {t.customer}
                    </Text>
                  </Column>
                  <Column style={{ width: "60%" }}>
                    <Text
                      style={{
                        fontSize: "13px",
                        fontWeight: "500",
                        color: "#333333",
                        margin: 0,
                        textAlign: "right",
                      }}
                    >
                      {customerName}
                    </Text>
                  </Column>
                </Row>
              )}
              <Row>
                <Column style={{ width: "40%" }}>
                  <Text
                    style={{
                      fontSize: "13px",
                      color: "#666666",
                      margin: 0,
                    }}
                  >
                    {t.plate}
                  </Text>
                </Column>
                <Column style={{ width: "60%" }}>
                  <Text
                    style={{
                      fontSize: "13px",
                      fontWeight: "500",
                      color: "#333333",
                      margin: 0,
                      textAlign: "right",
                    }}
                  >
                    {plate}
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* Services Table */}
            <Section style={{ marginBottom: "24px" }}>
              {/* Table Header */}
              <Row
                style={{
                  borderBottom: "2px solid #333333",
                  paddingBottom: "8px",
                }}
              >
                <Column style={{ width: "70%" }}>
                  <Text
                    style={{
                      fontSize: "12px",
                      fontWeight: "600",
                      textTransform: "uppercase" as const,
                      color: "#333333",
                      margin: 0,
                    }}
                  >
                    {t.service}
                  </Text>
                </Column>
                <Column style={{ width: "30%", textAlign: "right" }}>
                  <Text
                    style={{
                      fontSize: "12px",
                      fontWeight: "600",
                      textTransform: "uppercase" as const,
                      color: "#333333",
                      margin: 0,
                    }}
                  >
                    {t.price}
                  </Text>
                </Column>
              </Row>

              {/* Table Rows */}
              {validItems.map((item) => (
                <Row
                  key={item.id}
                  style={{
                    borderBottom: "1px solid #e0e0e0",
                    padding: "12px 0",
                  }}
                >
                  <Column style={{ width: "70%" }}>
                    <Text
                      style={{
                        fontSize: "14px",
                        color: "#333333",
                        margin: 0,
                      }}
                    >
                      {item.service}
                    </Text>
                  </Column>
                  <Column style={{ width: "30%", textAlign: "right" }}>
                    <Text
                      style={{
                        fontSize: "14px",
                        color: "#333333",
                        margin: 0,
                      }}
                    >
                      €{parseFloat(item.price).toFixed(2)}
                    </Text>
                  </Column>
                </Row>
              ))}
            </Section>

            {/* Totals */}
            <Section>
              <Row style={{ marginBottom: "4px" }}>
                <Column style={{ width: "70%" }}>
                  <Text
                    style={{
                      fontSize: "13px",
                      color: "#666666",
                      margin: 0,
                      textAlign: "right",
                    }}
                  >
                    {t.subtotal}
                  </Text>
                </Column>
                <Column style={{ width: "30%", textAlign: "right" }}>
                  <Text
                    style={{
                      fontSize: "13px",
                      color: "#666666",
                      margin: 0,
                    }}
                  >
                    €{subtotal.toFixed(2)}
                  </Text>
                </Column>
              </Row>

              <Row style={{ marginBottom: "8px" }}>
                <Column style={{ width: "70%" }}>
                  <Text
                    style={{
                      fontSize: "13px",
                      color: "#666666",
                      margin: 0,
                      textAlign: "right",
                    }}
                  >
                    {t.vat} (25.5%)
                  </Text>
                </Column>
                <Column style={{ width: "30%", textAlign: "right" }}>
                  <Text
                    style={{
                      fontSize: "13px",
                      color: "#666666",
                      margin: 0,
                    }}
                  >
                    €{vatAmount.toFixed(2)}
                  </Text>
                </Column>
              </Row>

              <Hr
                style={{
                  borderColor: "#333333",
                  borderWidth: "1px",
                  margin: "8px 0",
                }}
              />

              <Row>
                <Column style={{ width: "70%" }}>
                  <Text
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#333333",
                      margin: 0,
                      textAlign: "right",
                    }}
                  >
                    {t.total}
                  </Text>
                </Column>
                <Column style={{ width: "30%", textAlign: "right" }}>
                  <Text
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#333333",
                      margin: 0,
                    }}
                  >
                    €{total.toFixed(2)}
                  </Text>
                </Column>
              </Row>
            </Section>
          </Section>

          {/* Footer */}
          <Section
            style={{
              padding: "24px 40px",
              borderTop: "1px solid #e0e0e0",
              backgroundColor: "#fafafa",
            }}
          >
            <Text
              style={{
                fontSize: "13px",
                color: "#666666",
                margin: "0 0 4px 0",
                textAlign: "center",
              }}
            >
              {t.thankYou}
            </Text>
            <Text
              style={{
                fontSize: "12px",
                color: "#999999",
                margin: 0,
                textAlign: "center",
              }}
            >
              {t.footer}
            </Text>
          </Section>

          {/* Copyright */}
          <Section
            style={{
              padding: "16px 40px",
              borderTop: "1px solid #e0e0e0",
            }}
          >
            <Text
              style={{
                fontSize: "11px",
                color: "#999999",
                margin: 0,
                textAlign: "center",
              }}
            >
              © {new Date().getFullYear()} AutoSpa Opus. {t.copyright}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default Receipt;
