import { Box, Avatar, Stack, Button, AvatarBadge } from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { MdDelete } from "react-icons/md";
import { SyntheticEvent, useEffect, useState } from "react";
import { supabase } from "../api/supabase-client";
import { setUser } from "../features/user/user-slice";
import useUploadFileHook from "../hooks/useUploadFileHook";

const AvatarUpload = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { uploadFile, isUploading, errorUploading, publicUrl } =
    useUploadFileHook();

  const setFileHandler = (e: SyntheticEvent) => {
    let input = e.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      setFile(null);
      return;
    }

    let f = input.files[0];

    setFile(f);
  };

  useEffect(() => {
    if (file && user) {
      uploadFile({
        bucketName: "public",
        file,
        fileName: `${user.id}-avatar`,
        folder: "avatars",
      });
    }
  }, [file]);

  async function updateUserAvatar() {
    if (user) {
      let timestamp = +new Date();
      let { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .update({ avatar: publicUrl + "?" + timestamp })
        .match({ id: user.user_profile_id });
      if (profileError) {
        throw profileError;
      }

      if (publicUrl) {
        dispatch(setUser({ ...user, avatar: publicUrl + "?" + timestamp }));
      }
    }
  }
  useEffect(() => {
    if (publicUrl) {
      updateUserAvatar();
    }
  }, [publicUrl]);

  async function removeAvatar() {
    try {
      setIsLoading(true);
      let avatarUrl = user?.avatar?.split("?")[0];
      avatarUrl = avatarUrl?.split("/public/public/")[1];
      if (!avatarUrl) {
        setIsLoading(false);
        return;
      }
      const { data, error } = await supabase.storage
        .from("public")
        .remove([avatarUrl]);
      setIsLoading(false);
      if (error) {
        throw error;
      }

      let { data: updateData, error: updateError } = await supabase
        .from("profiles")
        .update({ avatar: "" })
        .match({ id: user?.user_profile_id });

      if (updateError) {
        throw updateError;
      }

      dispatch(setUser({ ...user, avatar: "" }));
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

      <Button as="label" htmlFor="fileInput" isLoading={isUploading}>
        Upload
      </Button>
      <input
        type="file"
        name="fileInput"
        id="fileInput"
        style={{ display: "none", position: "absolute" }}
        accept="image/*"
        onChange={setFileHandler}
      />
    </Stack>
  );
};

export default AvatarUpload;
