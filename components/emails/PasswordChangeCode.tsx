import { Html, Head, Body, Container, Heading, Text } from '@react-email/components';
 
const PasswordChangeCode = ({
  name,
  code
}:{
  name: string;
  code: string;
}) => {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: 'Arial, sans-serif', padding: '20px', backgroundColor: '#f9f9f9' }}>
        <Container style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px' }}>
          <Heading style={{ fontSize: '20px', marginBottom: '10px' }}>Hello {name},</Heading>
          <Text>You requested a password change. Here is your code:</Text>
          <Text style={{ fontWeight: 'bold', fontSize: '24px', marginTop: '10px' }}>{code}</Text>
          <Text style={{ marginTop: '10px' }}>This code will expire in 10 minutes.</Text>
          <Text style={{ marginTop: '10px' }}>If you did not request a password change, please ignore this email.</Text>
        </Container>
      </Body>
    </Html>
  );
};
 
export default PasswordChangeCode;