import { SyntheticEvent, useState } from "react";
import { useRouter } from "next/router";
import {
  InputRightElement,
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
import { MdOutlineAlternateEmail, MdLock } from "react-icons/md";
import { signinUser } from "../api/user";

const PasswordForm = () => {
  const toast = useToast();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formObj, setFormObj] = useState({
    name: "",
    email: "",
    password: "",
  });

  function updateFormObj(e: SyntheticEvent) {
    let input = e.target as HTMLInputElement;
    setFormObj({ ...formObj, [input.name]: input.value });
  }

  async function submitHandler(e: SyntheticEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      let user = await signinUser(formObj.email, formObj.password);
      router.push("/app");
      setLoading(false);
    } catch (e) {
      //console.log(e)
      setLoading(false);
      toast({
        status: "error",
        description: "Wrong username or password",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    }
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
            onInput={updateFormObj}
          >
            {" "}
            <MdOutlineAlternateEmail />
          </InputLeftElement>
          <Input type="email" name="email" onInput={updateFormObj} required />
        </InputGroup>
      </FormControl>
      <FormControl mb="10px">
        <FormLabel>
          <Text color={useColorModeValue("gray.600", "gray.100")}>
            Password:
          </Text>
        </FormLabel>
        <InputGroup>
          <InputLeftElement pointerEvents="none" color="gray.400">
            {" "}
            <MdLock />
          </InputLeftElement>
          <Input
            type={showPassword ? "text" : "password"}
            required
            name="password"
            onInput={updateFormObj}
          />
          <InputRightElement>
            <Button
              onClick={() => setShowPassword(!showPassword)}
              fontSize="xs"
              px="25px"
              size="sm"
              mr="20px"
            >
              {showPassword ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Center>
        <Button
          isLoading={loading}
          type="submit"
          colorScheme="blue"
          width="full"
          borderRadius="full"
          mt="20px"
        >
          Sign in
        </Button>
      </Center>
    </form>
  );
};

export default PasswordForm;
