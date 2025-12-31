import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Img,
  Section,
  Preview,
} from "@react-email/components";
import { TranslationFunction } from "@/lib/utils";

interface ReceiptEmailProps {
  customerName?: string;
  plate: string;
  t: TranslationFunction;
}

/**
 * Simple receipt email - the PDF attachment contains all invoice details.
 * Accepts a translation function for localized content.
 */
const Receipt = ({ customerName, plate, t }: ReceiptEmailProps) => {
  const greeting = customerName
    ? `${t("emailGreeting")} ${customerName}!`
    : `${t("emailGreeting")}!`;

  return (
    <Html>
      <Head>
        <meta name="color-scheme" content="light only" />
        <meta name="supported-color-schemes" content="light only" />
      </Head>
      <Preview>AutoSpa Opus - {plate}</Preview>
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
            maxWidth: "500px",
            margin: "0 auto",
            backgroundColor: "#ffffff",
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            padding: "40px",
          }}
        >
          {/* Logo */}
          <Section style={{ textAlign: "center", marginBottom: "32px" }}>
            <Img
              src="https://raw.githubusercontent.com/BlendiGR/autospa-opus/refs/heads/main/public/logo-opus.png"
              alt="AutoSpa Opus"
              width="120"
              style={{ margin: "0 auto" }}
            />
          </Section>

          {/* Message */}
          <Section>
            <Text
              style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "#333333",
                margin: "0 0 16px 0",
              }}
            >
              {greeting}
            </Text>
            <Text
              style={{
                fontSize: "15px",
                color: "#555555",
                lineHeight: "24px",
                margin: "0 0 16px 0",
              }}
            >
              {t("emailReceiptMessage")} <strong>{plate}</strong>.
            </Text>
            <Text
              style={{
                fontSize: "15px",
                color: "#555555",
                lineHeight: "24px",
                margin: "0 0 24px 0",
              }}
            >
              {t("emailKeepReceipt")}
            </Text>
          </Section>

          {/* Footer */}
          <Section
            style={{
              borderTop: "1px solid #e0e0e0",
              paddingTop: "24px",
              marginTop: "16px",
            }}
          >
            <Text
              style={{
                fontSize: "14px",
                color: "#666666",
                margin: "0 0 4px 0",
              }}
            >
              {t("thankYou")}
            </Text>
            <Text
              style={{
                fontSize: "13px",
                color: "#999999",
                margin: 0,
              }}
            >
              {t("footer")}
            </Text>
          </Section>

          {/* Copyright */}
          <Text
            style={{
              fontSize: "11px",
              color: "#999999",
              margin: "24px 0 0 0",
              textAlign: "center",
            }}
          >
            © {new Date().getFullYear()} AutoSpa Opus
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default Receipt;
