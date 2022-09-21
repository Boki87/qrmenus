import { SyntheticEvent, useState } from "react";
import { useRouter } from "next/router";
import {
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { supabase } from "../api/supabase-client";
import { MdOutlineAlternateEmail } from "react-icons/md";

const MagicLinkForm = () => {
  const router = useRouter();
  const toast = useToast();
  const [email, setEmail] = useState("");

  function updateEmailHandler(e: SyntheticEvent) {
    let input = e.target as HTMLInputElement;
    setEmail(input.value);
  }

  async function submitHandler(e: SyntheticEvent) {
    e.preventDefault();
    let { user, error } = await supabase.auth.signIn({ email });
    if (error) {
      return toast({
        status: "error",
        description:
          "Error sending your magic link. Please check your email and try again.",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    }

    toast({
      status: "success",
      description: "Your magic link is on the way. Please check your inbox.",
      duration: 4000,
      isClosable: true,
      position: "top",
    });
  }

  return (
    <form onSubmit={submitHandler}>
      <FormControl mb="10px">
        <FormLabel>
          <Text color={useColorModeValue("gray.600", "gray.100")}>
            Your email:
          </Text>
        </FormLabel>
        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            color="gray.400"
            children={<MdOutlineAlternateEmail />}
          />
          <Input type="email" required onInput={updateEmailHandler} />
        </InputGroup>
      </FormControl>
      <Center>
        <Button
          type="submit"
          colorScheme="blue"
          width="full"
          borderRadius="full"
          mt="20px"
        >
          Send magic link
        </Button>
      </Center>
    </form>
  );
};

export default MagicLinkForm;
