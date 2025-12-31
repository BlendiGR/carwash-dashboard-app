import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Preview,
} from "@react-email/components";
import { TranslationFunction } from "@/lib/utils";

interface ReceiptEmailProps {
  customerName?: string;
  plate: string;
  t: TranslationFunction;
}

/**
 * Simple text-only receipt email.
 * The PDF attachment contains all detailed invoice/receipt information.
 */
const Receipt = ({ customerName, plate, t }: ReceiptEmailProps) => {
  const greeting = customerName
    ? `${t("emailGreeting")} ${customerName}!`
    : `${t("emailGreeting")}!`;

  return (
    <Html>
      <Head />
      <Preview>AutoSpa Opus - {plate}</Preview>
      <Body style={mainStyle}>
        <Container style={containerStyle}>
          <Text style={textStyle}>{greeting}</Text>
          <Text style={textStyle}>
            {t("emailReceiptMessage")} <strong>{plate}</strong>.
          </Text>
          <br />
          <Text style={footerStyle}>{t("thankYou")}</Text>
          <Text style={footerStyle}>{t("footer")}</Text>
        </Container>
      </Body>
    </Html>
  );
};

const mainStyle = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
  margin: "0",
  padding: "0",
};

const containerStyle = {
  margin: "0 auto",
  padding: "20px",
};

const textStyle = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#333",
  margin: "0 0 16px 0",
};

const footerStyle = {
  fontSize: "14px",
  lineHeight: "24px",
  color: "#666",
  margin: "0 0 4px 0",
};

export default Receipt;
