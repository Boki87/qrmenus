import { ReactNode, useEffect } from "react";
import { supabase } from "../api/supabase-client";
import { getUserProfileFromSession } from "../api/user";
import { useAppDispatch } from "../app/hooks";
import { setUser } from "../features/user/user-slice";

interface AuthWrapperProps {
  children: ReactNode;
}

const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const dispatch = useAppDispatch();

  async function fetchProfile() {
    const session = supabase.auth.session();
    if (session?.user) {
      let profile = await getUserProfileFromSession(session.user);
      if (profile) {
        dispatch(setUser(profile));
      }
    } else {
      dispatch(setUser(null));
    }
  }

  useEffect(() => {
    fetchProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        //console.log(event, session)
        if (event === "SIGNED_OUT") {
          dispatch(setUser(null));
        }
        if (session?.user) {
          let profile = await getUserProfileFromSession(session.user);
          if (profile) {
            dispatch(setUser(profile));
          } else {
            dispatch(setUser(null));
          }
        }
        await fetch("/api/auth", {
          method: "POST",
          body: JSON.stringify({ event, session }),
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
    );

    return () => {
      return authListener?.unsubscribe();
    };
  }, []);

  return <>{children}</>;
};

export default AuthWrapper;
