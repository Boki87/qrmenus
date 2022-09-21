import { useEffect, useState, useRef } from "react";
import { supabase } from "../../api/supabase-client";
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

  useEffect(() => {
    window.addEventListener("hashchange", () => {
      const user = supabase.auth.user();
      //console.log(session)
      if (user) {
        setupUser(user);
      } else {
        router.push("/auth/signin");
      }
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
