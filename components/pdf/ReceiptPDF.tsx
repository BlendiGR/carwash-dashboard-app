import { Document, Page, Text, View, StyleSheet, Font, Image } from "@react-pdf/renderer";
import { TranslationFunction } from "@/lib/utils";

/** Register default font for consistent rendering */
Font.register({
  family: "Helvetica",
  fonts: [{ src: "Helvetica" }, { src: "Helvetica-Bold", fontWeight: "bold" }],
});

export type ReceiptPDFItem = {
  id?: string;
  service: string;
  price: string;
};

export type ReceiptPDFProps = {
  customerName?: string;
  plate: string;
  items: ReceiptPDFItem[];
  date: string;
  logoUrl: string;
  t: TranslationFunction;
  businessInfo: {
    phone: string;
    email: string;
    website: string;
    address: string;
    ytunnus: string;
  };
};

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 11,
    padding: 40,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerLeft: {
    flexDirection: "column",
    maxWidth: "50%",
  },
  logo: {
    width: 120,
    height: 60,
    objectFit: "contain" as const,
    marginBottom: 12,
  },
  contactInfo: {
    marginTop: 4,
  },
  contactRow: {
    flexDirection: "row",
    marginBottom: 3,
  },
  contactLabel: {
    fontSize: 8,
    color: "#666666",
    width: 55,
  },
  contactValue: {
    fontSize: 8,
    color: "#333333",
  },
  headerRight: {
    textAlign: "right",
    maxWidth: "45%",
  },
  invoiceTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 4,
  },
  date: {
    fontSize: 10,
    color: "#666666",
    marginBottom: 12,
  },
  businessInfo: {
    marginTop: 8,
  },
  businessRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 3,
  },
  businessLabel: {
    fontSize: 8,
    color: "#666666",
    marginRight: 8,
  },
  businessValue: {
    fontSize: 8,
    color: "#333333",
    textAlign: "right",
  },
  infoBox: {
    backgroundColor: "#fafafa",
    padding: 14,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  infoLabel: {
    fontSize: 10,
    color: "#666666",
  },
  infoValue: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#333333",
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: "#333333",
    paddingBottom: 8,
    marginBottom: 8,
  },
  tableHeaderText: {
    fontSize: 9,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#333333",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingVertical: 10,
  },
  serviceColumn: {
    width: "70%",
  },
  priceColumn: {
    width: "30%",
    textAlign: "right",
  },
  tableText: {
    fontSize: 11,
    color: "#333333",
  },
  totalsSection: {
    marginTop: 16,
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 4,
  },
  totalsLabel: {
    fontSize: 10,
    color: "#666666",
    width: 100,
    textAlign: "right",
    marginRight: 20,
  },
  totalsValue: {
    fontSize: 10,
    color: "#666666",
    width: 80,
    textAlign: "right",
  },
  totalDivider: {
    borderTopWidth: 1,
    borderTopColor: "#333333",
    marginTop: 8,
    paddingTop: 8,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333333",
    width: 100,
    textAlign: "right",
    marginRight: 20,
  },
  totalValue: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333333",
    width: 80,
    textAlign: "right",
  },
  footer: {
    marginTop: 40,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    textAlign: "center",
  },
  thankYou: {
    fontSize: 11,
    color: "#666666",
    marginBottom: 4,
  },
  footerText: {
    fontSize: 10,
    color: "#999999",
  },
  copyright: {
    marginTop: 20,
    fontSize: 9,
    color: "#999999",
    textAlign: "center",
  },
});

/**
 * PDF Receipt document component.
 * Accepts a translation function for localized content.
 */
const ReceiptPDF = ({
  customerName,
  plate,
  items,
  date,
  logoUrl,
  t,
  businessInfo,
}: ReceiptPDFProps) => {
  const validItems = items.filter((item) => item.service && item.price);
  const total = validItems.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
  const vatRate = 0.255;
  const vatAmount = total * (vatRate / (1 + vatRate));
  const subtotal = total - vatAmount;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          {/* Left side: Logo + Contact info */}
          <View style={styles.headerLeft}>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image src={logoUrl} style={styles.logo} />
            <View style={styles.contactInfo}>
              <View style={styles.contactRow}>
                <Text style={styles.contactLabel}>{t("phoneLabel")}</Text>
                <Text style={styles.contactValue}>{businessInfo.phone}</Text>
              </View>
              <View style={styles.contactRow}>
                <Text style={styles.contactLabel}>{t("emailLabel")}</Text>
                <Text style={styles.contactValue}>{businessInfo.email}</Text>
              </View>
              <View style={styles.contactRow}>
                <Text style={styles.contactLabel}>{t("websiteLabel")}</Text>
                <Text style={styles.contactValue}>{businessInfo.website}</Text>
              </View>
            </View>
          </View>

          {/* Right side: Invoice title + Business info */}
          <View style={styles.headerRight}>
            <Text style={styles.invoiceTitle}>{t("invoiceTitle")}</Text>
            <Text style={styles.date}>{date}</Text>
            <View style={styles.businessInfo}>
              <View style={styles.businessRow}>
                <Text style={styles.businessLabel}>{t("addressLabel")}</Text>
                <Text style={styles.businessValue}>{businessInfo.address}</Text>
              </View>
              <View style={styles.businessRow}>
                <Text style={styles.businessLabel}>{t("businessIdLabel")}</Text>
                <Text style={styles.businessValue}>{businessInfo.ytunnus}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Customer Info */}
        <View style={styles.infoBox}>
          {customerName && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t("customerName")}</Text>
              <Text style={styles.infoValue}>{customerName}</Text>
            </View>
          )}
          <View style={[styles.infoRow, { marginBottom: 0 }]}>
            <Text style={styles.infoLabel}>{t("plate")}</Text>
            <Text style={styles.infoValue}>{plate}</Text>
          </View>
        </View>

        {/* Services Table */}
        <View style={styles.tableHeader}>
          <View style={styles.serviceColumn}>
            <Text style={styles.tableHeaderText}>{t("service")}</Text>
          </View>
          <View style={styles.priceColumn}>
            <Text style={styles.tableHeaderText}>{t("price")}</Text>
          </View>
        </View>

        {validItems.map((item, index) => (
          <View key={item.id || index} style={styles.tableRow}>
            <View style={styles.serviceColumn}>
              <Text style={styles.tableText}>{item.service}</Text>
            </View>
            <View style={styles.priceColumn}>
              <Text style={styles.tableText}>€ {parseFloat(item.price).toFixed(2)}</Text>
            </View>
          </View>
        ))}

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>{t("subtotal")}</Text>
            <Text style={styles.totalsValue}>€ {subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>{t("vat")} (25.5%)</Text>
            <Text style={styles.totalsValue}>€ {vatAmount.toFixed(2)}</Text>
          </View>
          <View style={styles.totalDivider}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>{t("total")}</Text>
              <Text style={styles.totalValue}>€ {total.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.thankYou}>{t("thankYou")}</Text>
          <Text style={styles.footerText}>{t("footer")}</Text>
        </View>

        <Text style={styles.copyright}>© {new Date().getFullYear()} AutoSpa Opus.</Text>
      </Page>
    </Document>
  );
};

export default ReceiptPDF;
