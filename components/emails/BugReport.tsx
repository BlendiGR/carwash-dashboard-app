import { Html, Head, Body, Container, Text, Preview, Hr } from "@react-email/components";

interface BugReportProps {
  reporterName: string;
  subject: string;
  description: string;
}

/**
 * Simple bug report email for admin notifications.
 */
const BugReport = ({ reporterName, subject, description }: BugReportProps) => {
  return (
    <Html>
      <Head />
      <Preview>Bug Report: {subject}</Preview>
      <Body style={mainStyle}>
        <Container style={containerStyle}>
          <Text style={headingStyle}>Bug Report</Text>
          <Hr style={hrStyle} />
          <Text style={labelStyle}>Reported by:</Text>
          <Text style={textStyle}>
            {reporterName}
          </Text>
          <Text style={labelStyle}>Subject:</Text>
          <Text style={textStyle}>{subject}</Text>
          <Text style={labelStyle}>Description:</Text>
          <Text style={descriptionStyle}>{description}</Text>
        </Container>
      </Body>
    </Html>
  );
};

const mainStyle = {
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
  margin: "0",
  padding: "0",
  backgroundColor: "#f5f5f5",
};

const containerStyle = {
  margin: "0 auto",
  padding: "32px",
  backgroundColor: "#ffffff",
  maxWidth: "600px",
};

const headingStyle = {
  fontSize: "20px",
  fontWeight: "700" as const,
  color: "#333",
  margin: "0 0 16px 0",
};

const hrStyle = {
  borderColor: "#e0e0e0",
  margin: "16px 0",
};

const labelStyle = {
  fontSize: "12px",
  fontWeight: "600" as const,
  color: "#666",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  margin: "16px 0 4px 0",
};

const textStyle = {
  fontSize: "16px",
  lineHeight: "24px",
  color: "#333",
  margin: "0 0 8px 0",
};

const descriptionStyle = {
  fontSize: "14px",
  lineHeight: "22px",
  color: "#333",
  margin: "0",
  whiteSpace: "pre-wrap" as const,
};

export default BugReport;
