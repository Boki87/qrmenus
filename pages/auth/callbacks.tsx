import { useEffect, useState, useRef } from "react";
import { supabase } from "../../api/supabase-client";
import type { GetServerSideProps, GetServerSideProps } from "next";
import { createUserProfileFromGoogle } from "../../api/user";
import { Box, Spinner } from "@chakra-ui/react";
import { useAppDispatch } from "../../app/hooks";
import { setUser } from "../../features/user/user-slice";
import { useRouter } from "next/router";

const Callbacks = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  async function setupUser(user: any) {
    try {
      let profile = await createUserProfileFromGoogle(user);
      if (user.id) {
        dispatch(setUser(profile));
        //router.push('/app')
      }

      router.push("/auth/signin");
    } catch (e) {
      console.log(e);
    }
  }

  async function checkForAuthHash() {
    const session = supabase.auth.session();
    await fetch("/api/auth", {
      method: "POST",
      body: JSON.stringify({ event: "SIGNED_IN", session }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (session?.user) {
      setupUser(session.user);
    } else {
      router.push("/auth/signin");
    }
  }

  useEffect(() => {
    if (window.location.hash.includes("access_token")) {
      checkForAuthHash();
    }
    window.addEventListener("hashchange", () => {
      checkForAuthHash();
    });

    return () => window.removeEventListener("hashchange", () => {});
  }, []);

  return (
    <Box
      w="full"
      h="full"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Spinner />
    </Box>
  );
};

export default Callbacks;

/*export const getServerSideProps: GetServerSideProps = async (context) => {

    const {access_token} = context.query

  return {
    props: {},
  };
};*/
