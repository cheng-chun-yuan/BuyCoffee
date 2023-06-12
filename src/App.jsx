import {
  Container,
  Box,
  Flex,
  Text,
  Image,
  Center,
  SimpleGrid,
  Card, CardBody,
  Heading,
  Input,
  Skeleton,
  Textarea,
  Stack,
  Tooltip
} from '@chakra-ui/react'
import dayjs from "dayjs";
import CarLogo from './coffee.svg'
import { ConnectWallet, Web3Button, useContract, useContractRead } from '@thirdweb-dev/react';
import { RENTACAR_ADDRESS } from './const/contractAddress';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { InfoOutlineIcon } from '@chakra-ui/icons';

// import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react'
export default function Home() {
  const { contract } = useContract(RENTACAR_ADDRESS)
  const [name, setName] = useState('')
  const [name2, setName2] = useState('')
  const [message, setMessage] = useState('')
  const [message2, setMessage2] = useState('')
  // useEffect(()=>{
  //   console.log('contract',contract)
  // },[contract])
  const {
    data: totalCar,
    isLoading: loadingTotalCar
  } = useContractRead(contract, 'getTotalCar')
  const {
    data: recentCar,
    isLoading: loadingRecentCar
  } = useContractRead(contract, 'getAllCar')
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
              src={CarLogo}
              width={50}
              height={50}
              alt='a Car picture'
            />
            <Text
              w='100%'
              fontWeight={600}
              fontSize={'24px'}
            >
              Rent me Car
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
                    Rent me a Car
                  </Heading>
                  <Flex>
                    <Text>Total Car : </Text>
                    <Skeleton
                      isLoaded={!loadingTotalCar}
                      width={'10px'}
                    >
                      {totalCar?.toString()}
                    </Skeleton>
                  </Flex>
                  <Text
                    fontSize={'xl'}
                    mt={'10px'}
                    py={'10px'}
                  >
                    車車名稱
                  </Text>
                  <Input
                    bg={'gray.100'}
                    maxLength={16}
                    placeholder='carname'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <Text
                    fontSize={'xl'}
                    mt={'10px'}
                    py={'10px'}
                  >
                    你的名稱
                  </Text>
                  <Input
                    bg={'gray.100'}
                    maxLength={16}
                    placeholder='_username'
                    value={name2}
                    onChange={(e) => setName2(e.target.value)}
                  />
                  <Text
                    fontSize={'xl'}
                    py={'10px'}
                  >
                    hour
                  </Text>
                  <Input
                    bg={'gray.100'}
                    maxLength={16}
                    placeholder='hour'
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <Text
                    fontSize={'xl'}
                    py={'10px'}
                  >
                    price
                  </Text>
                  <Input
                    bg={'gray.100'}
                    maxLength={16}
                    placeholder='price'
                    value={message2}
                    onChange={(e) => setMessage2(e.target.value)}
                  />
                  <Box mt={'20px'}>
                    <Center>
                      <Web3Button
                        contractAddress={RENTACAR_ADDRESS}
                        action={async () => {
                          await contract.call('buyCar', [name, name2, message, message2], {
                            value: message2 * message
                          })
                        }}
                        onSuccess={() => {
                          setMessage('')
                          setName('')
                          alert('成功囉')
                        }}
                        onError={(error) => {
                          alert(error)
                        }}
                      >
                        豬車
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
                    Who rent Car
                  </Heading>
                  {!loadingRecentCar ?
                    (
                      <Box>
                        {recentCar && recentCar?.map((Car, index) => {
                          return (
                            <Card key={index} my={'10px'}>
                              <CardBody>
                                <Flex alignItems={'center'} mb={'10px'}>
                                  <Image
                                    src={CarLogo}
                                    alt='Car'
                                    width={30}
                                    height={30}
                                    mr={'10px'}
                                  />
                                  <Text fontWeight={'bold'} mr={'10px'}>
                                    {Car[2] ? Car[2] : '匿名人士'}
                                  </Text>
                                  <Tooltip
                                    label={`Time:${dayjs.unix(Car[1]?.toString())}`}
                                    bg={'gray.200'}
                                    color={'black'}
                                  >
                                    <InfoOutlineIcon />
                                  </Tooltip>
                                </Flex>
                                <Flex>
                                  <Text mr={'10px'}>
                                    Car : {Car[5] ? Car[5] : 'no message'}
                                  </Text>
                                </Flex>
                                <Flex>
                                  <Text mr={'10px'}>
                                    Hour : {Car[3]?.toString() ? Car[3]?.toString() : 'no message'}
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
                        <Skeleton height={'100px'} />
                        <Skeleton height={'100px'} />
                        <Skeleton height={'100px'} />
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
