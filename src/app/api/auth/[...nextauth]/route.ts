import NextAuth from "next-auth";
import CognitoProvider from "next-auth/providers/cognito";
import CredentialsProvider from "next-auth/providers/credentials";
import {
  AuthFlowType,
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const cognitoProvider = CognitoProvider({
  clientId: process.env.COGNITO_CLIENT_ID_HOSTED as string,
  clientSecret: process.env.COGNITO_CLIENT_SECRET as string,
  issuer: process.env.COGNITO_ISSUER as string,
  checks: "nonce",
});

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.REGION,
});

const customCognito = CredentialsProvider({
  name: "Credentials",
  credentials: {
    email: { label: "Email", type: "text", placeholder: "Email" },
    password: { label: "Contraseña", type: "password" },
  },
  async authorize(credentials: any) {
    if (!credentials) return null;

    const params = {
      AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
      ClientId: process.env.COGNITO_CLIENT_ID_NO_HOSTED as string,
      AuthParameters: {
        USERNAME: credentials.email,
        PASSWORD: credentials.password,
      },
    };

    try {
      const command = new InitiateAuthCommand(params);
      const result = await cognitoClient.send(command);

      const auth = {
        idToken: result.AuthenticationResult?.IdToken || "",
        accessToken: result.AuthenticationResult?.AccessToken || "",
        refreshToken: result.AuthenticationResult?.RefreshToken || "",
      };

      console.log("Auth aws: ", auth);

      const user = {
        id: credentials.username,
        email: credentials.email,
      };
      return user;
    } catch (error) {
      console.error("Error signing in: ", error);
      throw error;
    }
  },
});

const handler = NextAuth({
  providers: [cognitoProvider, customCognito],
});

export { handler as GET, handler as POST };
