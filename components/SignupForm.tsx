import { SyntheticEvent, useState } from "react";
import { signupUser } from "../api/user";
import {useRouter} from 'next/router'
import {
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Text,
  useColorModeValue,
  useToast
} from "@chakra-ui/react";
import {
  MdOutlineAlternateEmail,
  MdLock,
  MdPersonOutline,
} from "react-icons/md";

const SignupForm = () => {
    const router = useRouter()
    const toast = useToast()
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false)

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
        setLoading(true)
        let newUser = await signupUser(formObj.name, formObj.email, formObj.password)  
        router.push('/auth/signin')        
        setLoading(false)
        toast({
            status: 'success',
            description: 'You have successfully registerd an account.',
            duration: 4000,
            isClosable: true,
            position: 'top'
        })
    }catch(e){
        setLoading(false)
        toast({
            status: 'error',
            description: 'Error registering your account. Plesae refresh the page and try again.',
            duration: 4000,
            isClosable: true,
            position: 'top'
        })
        console.log(e)
    }
  }

  return (
    <form onSubmit={submitHandler}>
      <FormControl mb="10px">
        <FormLabel>
          <Text color={useColorModeValue("gray.600", "gray.100")}>
            Your name:
          </Text>
        </FormLabel>
        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            color="gray.400"
            children={<MdPersonOutline />}
          />
          <Input type="text" name="name" onInput={updateFormObj} required />
        </InputGroup>
      </FormControl>
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
            onInput={updateFormObj}
          />
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
          <InputLeftElement
            pointerEvents="none"
            color="gray.400"
            children={<MdLock />}
          />
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
          colorScheme="blue"
          width="full"
          borderRadius="full"
          mt="20px"
          type="submit"
          isLoading={loading}
        >
          Sign up
        </Button>
      </Center>
    </form>
  );
};

export default SignupForm;
