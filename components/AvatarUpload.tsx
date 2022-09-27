import { Box, Avatar, Stack, Button, AvatarBadge } from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { MdDelete } from "react-icons/md";
import { SyntheticEvent, useState } from "react";
import { supabase } from "../api/supabase-client";
import { setUser } from "../features/user/user-slice";

const AvatarUpload = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);

  const [isLoading, setIsLoading] = useState(false);

  async function uploadAvatarHandler(e: SyntheticEvent) {
    try {
      setIsLoading(true);
      let input = e.target as HTMLInputElement;

      if (!input.files || input.files.length === 0) {
        throw new Error("You must select and image to upload");
      }

      const file = input.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${user?.id}-avatar.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      let { data, error: uploadError } = await supabase.storage
        .from("public")
        .upload(filePath, file, {
          upsert: true,
        });

      const { publicURL, error: readError } = supabase.storage
        .from("public")
        .getPublicUrl("avatars/" + fileName);

      if (uploadError) {
        throw uploadError;
      }

      if (readError) {
        throw readError;
      }

      if (user) {
        let timestamp = +new Date();
        let { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .update({ avatar: publicURL + "?" + timestamp })
          .match({ id: user.user_profile_id });
        if (profileError) {
          throw profileError;
        }

        if (publicURL) {
          dispatch(setUser({ ...user, avatar: publicURL + "?" + timestamp }));
        }
      }

      setIsLoading(false);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  }

  async function removeAvatar() {
    try {
      setIsLoading(true);
      let avatarUrl = user?.avatar?.split("?")[0];
      avatarUrl = avatarUrl?.split('/public/public/')[1]
      if (!avatarUrl) {
        setIsLoading(false);
        return;
      }
      console.log(avatarUrl)
      const { data, error } = await supabase.storage
        .from("public")
        .remove([avatarUrl]);
      setIsLoading(false);
      if (error) {
        throw error;
      }

        
      let {data: updateData, error: updateError} = await supabase.from('profiles').update({avatar: ''}).match({id: user?.user_profile_id})
        
            if(updateError) {
                throw updateError
            }




      dispatch(setUser({...user, avatar: undefined}))

    } catch (e) {
      setIsLoading(false);
      console.log(e);
    }
  }

  return (
    <Stack>
      <Avatar size="2xl" mb="10px" name={user?.name} src={user?.avatar}>
        {user?.avatar && (
          <AvatarBadge
            onClick={removeAvatar}
            boxSize="1.25em"
            w="30px"
            right="2"
            bottom="2"
            h="30px"
            color="white"
            border="none"
            cursor="pointer"
            bg="red.400"
            fontSize="xl"
          >
            <MdDelete />
          </AvatarBadge>
        )}
      </Avatar>

      <Button as="label" htmlFor="fileInput" isLoading={isLoading}>
        Upload
      </Button>
      <input
        type="file"
        name="fileInput"
        id="fileInput"
        style={{ display: "none", position: "absolute" }}
        accept="image/*"
        onChange={uploadAvatarHandler}
      />
    </Stack>
  );
};

export default AvatarUpload;
