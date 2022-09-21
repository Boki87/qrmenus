import { Box, Avatar, Stack, Button, AvatarBadge } from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { MdDelete } from "react-icons/md";
import { SyntheticEvent, useState } from "react";
import { supabase } from "../api/supabase-client";

const AvatarUpload = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);

  const [isLoading, setIsLoading] = useState(false);




    async function uploadAvatarHandler(e: SyntheticEvent) {
        try {
            setIsLoading(true)
            let input = (e.target as HTMLInputElement)

            if(!input.files || input.files.length === 0) {
                throw new Error('You must select and image to upload')
            }

            const file = input.files[0]
            const fileExt = file.name.split('.').pop()
            const fileName = `${user?.id}-avatar.${fileExt}`
            const filePath = `avatars/${fileName}`
           
            let {data, error: uploadError} = await supabase.storage.from('media').upload(filePath, file)
            console.log(data)
            if(uploadError) {
                throw uploadError
            }

            setIsLoading(false)

        }catch(e) {
            console.log(e)
            setIsLoading(false)
        }
            
    }


  return (
    <Stack>
      <Avatar size="2xl" mb="10px" name={user?.name} src={user?.avatar} zIndex={-1}>
        <AvatarBadge
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
      </Avatar>

      <Button as="label" htmlFor="fileInput" isLoading={isLoading}>
        Upload
      </Button>
      <input
        type="file"
        name="fileInput"
        id="fileInput"
        style={{ visibility: "hidden", position: "absolute" }}
        accept="image/*"
        onChange={uploadAvatarHandler} 
      />
    </Stack>
  );
};

export default AvatarUpload;
