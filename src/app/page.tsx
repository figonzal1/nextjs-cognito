"use client";

import { signIn, signOut, useSession } from "next-auth/react";

const Home = () => {
  const { data: session, status } = useSession();

  if (session) {
    return (
      <main className="flex flex-col items-center justify-center p-24 gap-10">
        <h1 className="text-6xl text-white font-bold">Testing cognito</h1>

        <h3 className="text-xl">Usuario logueado como {session.user?.email}</h3>
        <p className="text-pretty w-full overflow-auto break-words">id_token {session.user?.idToken}</p>
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

          <button
            className="bg-blue-500 p-3 rounded-xl"
            onClick={() => signIn('cognito')}
          >
            Iniciar sesión (cognito)
          </button>
        </>
      )}
    </main>
  );
};

export default Home;
