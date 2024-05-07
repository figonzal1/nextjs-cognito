"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect } from "react";

const Home = () => {
  const { data: session, status } = useSession();

  useEffect(() => {
    console.log("Status", status);
    console.log("Session", session);
  }, [session, status]);

  if (session) {
    return (
      <main className="flex flex-col items-center justify-center p-24 gap-10">
        <h1 className="text-6xl text-white font-bold">Testing cognito</h1>

        <h3 className="text-xl">Usuario logueado como {session.user?.email}</h3>
        <button
          className="bg-orange-400 p-3 rounded-xl"
          onClick={() => signOut()}
        >
          Cerrar sesión
        </button>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center p-24 gap-10">
      <h1 className="text-6xl text-white font-bold">Testing cognito</h1>

      {status === "loading" ? (
        <p>Cargando...</p>
      ) : (
        <>
          <h3 className="text-xl">Usuario no logeado</h3>
          <button
            className="bg-blue-500 p-3 rounded-xl"
            onClick={() => signIn()}
          >
            Iniciar sesión
          </button>
        </>
      )}
    </main>
  );
};

export default Home;
