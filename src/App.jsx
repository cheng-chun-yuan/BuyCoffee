import {
  Container,
  Box,
  Flex,
  Text,
  Image,
  Center,
  SimpleGrid,
  Card,CardBody,
  Heading,
  Input,
  Skeleton,
  Textarea,
  Stack,
  Tooltip
} from '@chakra-ui/react'
import CoffeeLogo from './coffee.svg'
import { ConnectWallet,Web3Button,useContract, useContractRead } from '@thirdweb-dev/react';
import { BUYACOFFEE_ADDRESS } from './const/contractAddress';
import { useState,useEffect } from 'react';
import { ethers } from 'ethers';
import { InfoOutlineIcon } from '@chakra-ui/icons';

// import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react'
export default function Home() {
  const {contract} = useContract(BUYACOFFEE_ADDRESS)
  const [name ,setName] = useState('') 
  const [message ,setMessage] = useState('') 
  // useEffect(()=>{
  //   console.log('contract',contract)
  // },[contract])
  const {
    data:totalCoffee,
    isLoading: loadingTotalCoffee
  } = useContractRead(contract,'getTotalCoffee')
  const {
    data:recentCoffee,
    isLoading: loadingRecentCoffee
  } = useContractRead(contract,'getAllCoffee')
  useEffect(() =>{
    if (recentCoffee){
      console.log('recentCoffee',recentCoffee)
    }
  },[recentCoffee])
  return (
    <Box bg='#FEFEFE' w={'100%'} h={'100%'} >
      <Container maxW={'1200px'} w={'100%'}>
        {/**/}
        <Flex
          px='10px'
          bg={'#fff'}  
          h={'120px'}
          borderRadius={'20px'}
          boxShadow={'lg'}
        >
          <Center w='100%'>
            <Image
              src={CoffeeLogo}
              width={50}
              height={50}
              alt='a coffee picture'
            />
            <Text
              w='100%'
              fontWeight={600}
              fontSize={'24px'}
            >
              Buy me coffee
            </Text>
            <Box mr='2rem'>
              <ConnectWallet
                btnTitle='連結錢包'
              />
            </Box>
          </Center>
        </Flex>
        <Flex
          w={'100%'}
          alignItems={'center'}
          justifyContent={'space-between'}
          py={'20px'}
          height={'100px'}
          flexDirection={'column'}
        >
          <SimpleGrid
            columns={2}
            spacing={10}
            mt={'40px'}
            w={'100%'}
          >
            {/*左邊*/}
            <Box>
              <Card>
                <CardBody>
                  <Heading
                    size={'md'}
                    mb={'20px'}
                  >
                    Buy me a coffee
                  </Heading>
                  <Flex>
                    <Text>Total Coffee : </Text>
                    <Skeleton
                      isLoaded={!loadingTotalCoffee}
                      width={'10px'}
                    >
                      {totalCoffee?.toString()}
                    </Skeleton>
                  </Flex>
                  <Text
                    fontSize={'xl'}
                    mt={'10px'}
                    py={'10px'}
                  >
                    妳的名字
                  </Text>
                  <Input
                    bg={'gray.100'}
                    maxLength={16}
                    placeholder='input your name ex:Albert'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <Text
                    fontSize={'xl'}
                    py={'10px'}
                  >
                    訊息
                  </Text>
                  <Textarea
                    bg={'gray.100'}
                    size={'lg'}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder='give me information'
                  />
                  <Box mt={'20px'}>
                    <Center>
                      <Web3Button
                        contractAddress={BUYACOFFEE_ADDRESS}
                        action={async() => {
                          await contract.call('buyCoffee',[message,name],{
                            value: ethers.utils.parseEther('0.01')
                          })
                        }}
                        onSuccess={() =>{
                          setMessage('')
                          setName('')
                          alert('成功囉')
                        }}
                        onError={(error) =>{
                          alert(error)
                        }}
                      >
                        買一杯咖啡 0.01 Eth
                      </Web3Button>
                    </Center>
                  </Box>
                </CardBody>
              </Card>
            </Box>
            <Box>
              <Card maxH={'50vh'} overflow={'scroll'}>
                <CardBody>
                  <Heading 
                    mb={'20px'} 
                    size={'md'}
                  >
                    Who buy coffee
                  </Heading>
                  {!loadingRecentCoffee ?
                    (
                      <Box>
                        {recentCoffee && recentCoffee?.map((coffee,index) => {
                          return (
                            <Card key={index} my={'10px'}>
                              <CardBody>
                                <Flex alignItems={'center'} mb={'10px'}>
                                  <Image
                                    src={CoffeeLogo}
                                    alt='Coffee'
                                    width={30}
                                    height={30}
                                    mr={'10px'}
                                  />
                                  <Text fontWeight={'bold'} mr={'10px'}>
                                    {coffee[2]?coffee[2]:'匿名人士'}
                                  </Text>
                                  <Tooltip
                                    label={`錢包地址:${coffee[0]}`}
                                    bg={'gray.200'}
                                    color={'black'}
                                  >
                                    <InfoOutlineIcon/>
                                  </Tooltip>
                                </Flex>
                                <Flex>
                                <Text  mr={'10px'}>
                                    {coffee[1]?coffee[1]:'no message'}
                                  </Text>
                                </Flex>
                              </CardBody>
                            </Card>
                          )
                          })
                        }
                      </Box>
                    ) : (
                      <Stack>
                        <Skeleton height={'100px'}/>
                        <Skeleton height={'100px'}/>
                        <Skeleton height={'100px'}/>
                      </Stack>
                    )
                  }
                </CardBody>
              </Card>
            </Box>
          </SimpleGrid>
        </Flex>
      </Container>
    </Box>
  );
}
