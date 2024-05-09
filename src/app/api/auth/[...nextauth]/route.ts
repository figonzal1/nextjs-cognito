import NextAuth, { Account, Profile, User } from "next-auth";
import CognitoProvider from "next-auth/providers/cognito";
import CredentialsProvider from "next-auth/providers/credentials";
import {
  AuthFlowType,
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { JWT } from "next-auth/jwt";

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
  callbacks: {
    session({ session, token, user }) {
  
      session.user.idToken = token.idToken;

      console.log("TOken", token);
      console.log("Session", session);
      console.log("Usuario", user);

      return session; // The return type will match the one returned in `useSession()`
    },

    jwt({ account, token, user, profile, session, trigger }) {
      console.log("Account", account);
      console.log("Token", token);

      if(account){
        token.idToken =  account?.id_token;
      }

      return token;
    },
  },
});

export { handler as GET, handler as POST };
