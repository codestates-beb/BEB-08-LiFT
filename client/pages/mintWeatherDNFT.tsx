import { NextPage } from 'next';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Link,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import { ThirdwebStorage } from '@thirdweb-dev/storage';
import { Input } from '@mantine/core';
//import LoadingOverlay from 'react-loading-overlay-ts';
import { useSession } from 'next-auth/react';
import FlipCard, { BackCard, FrontCard } from '../components/FlipCard';

import { DEFAULT_THEME, LoadingOverlay } from '@mantine/core';
import { useQuery } from 'wagmi';

interface Weather {
  name: string;
  description: string;
  image: string;
  attributes: {
    trait_type: string;
    value: string;
  }[];
}

interface WeatherData {
  owner_address: String;
  locationId: Number;
  sun: Weather;
  rain: Weather;
  cloud: Weather;
  snow: Weather;
}

const Weather: WeatherData = {
  owner_address: '',
  locationId: 1, // 추가하기
  sun: {
    name: 'sun',
    description: 'sun description',
    image: 'http://gateway',
    attributes: [
      {
        trait_type: 'location name',
        value: '서울',
      },
      {
        trait_type: 'latitude',
        value: '37',
      },
      {
        trait_type: 'longitude',
        value: '127',
      },
    ],
  },
  rain: {
    name: 'rain',
    description: 'rain description',
    image: 'http://gateway',
    attributes: [
      {
        trait_type: 'location name',
        value: '서울',
      },
      {
        trait_type: 'latitude',
        value: '37',
      },
      {
        trait_type: 'longitude',
        value: '127',
      },
    ],
  },
  cloud: {
    name: 'cloud',
    description: 'cloud description',
    image: 'http://gateway',
    attributes: [
      {
        trait_type: 'location name',
        value: '서울',
      },
      {
        trait_type: 'latitude',
        value: '37',
      },
      {
        trait_type: 'longitude',
        value: '127',
      },
    ],
  },
  snow: {
    name: 'snow',
    description: 'snow description',
    image: 'http://gateway',
    attributes: [
      {
        trait_type: 'location name',
        value: '서울',
      },
      {
        trait_type: 'latitude',
        value: '37',
      },
      {
        trait_type: 'longitude',
        value: '127',
      },
    ],
  },
};

interface Data {
  type: string;
  nonce: string;
  gas: string;
  hash: string;
}

interface MyDNFT {
  token_id: number;
}

interface Property {
  trait_type: string;
  value: string;
}

// sun, rain, cloudy, snow => 0, 1, 2, 3
// seoul: 37.5 126.9 / london: 36.9 -93.9 new york 40.7 -74

const Create: NextPage = (props) => {
  const [ImageUri, setImageUri] = useState('https://example.com/snow.jpg');

  const [tokenNum, setTokenNum] = useState(0);
  const { data: session } = useSession();

  const [properties, setProperties] = useState<Property[]>([
    {
      trait_type: '',
      value: '',
    },
  ]);

  const { data: myDNFT } = useQuery<{ nft: MyDNFT[] }, unknown, MyDNFT[]>(
    [`http://152.69.231.140:1323/mypage?owner_address=${session?.address}`],
    async () => {
      try {
        const response = await fetch(
          `http://152.69.231.140:1323/mypage?owner_address=${session?.address}`,
          {
            method: 'GET',
          }
        );
        const data = await response.json();
        console.log('userMydata' + JSON.stringify(response));
        setTokenNum(data.length);
        return data;
      } catch (error) {
        console.log('Error: ' + error);
      }
    }
  );

  const tokenCount = myDNFT;

  const [message, setMessage] = useState<Data | null>(null);
  const [activating, setActivating] = useState(false);
  const [ipfsing, setIpfsing] = useState(false);

  const [location, setLocation] = useState('');

  console.log(location);

  const [file1, setFile1] = useState([]);
  const [file2, setFile2] = useState([]);
  const [file3, setFile3] = useState([]);
  const [file4, setFile4] = useState([]);

  const [name1, setName1] = useState('');
  const [description1, setDescription1] = useState('');

  const [name2, setName2] = useState('');
  const [description2, setDescription2] = useState('');

  const [name3, setName3] = useState('');
  const [description3, setDescription3] = useState('');

  const [name4, setName4] = useState('');
  const [description4, setDescription4] = useState('');

  const [sunImageUri, setSunImageUri] = useState(''); // 숫자가 있으면 안된다.
  const [rainImageUri, setRainImageUri] = useState(''); // TODO: 숫자가 있으면 저장이 안되는 이유 알아내기
  const [cloudyImageUri, setCloudImageUri] = useState('');
  const [snowImageUri, setSnowImageUri] = useState('');

  const [ipfsUrlArray, setIpfsUrlArray] = useState([]);

  const storage = new ThirdwebStorage();

  Weather.owner_address = session?.address;
  console.log('mint address' + session?.address);

  Weather.sun.name = name1;
  Weather.sun.description = description1;
  Weather.sun.image = sunImageUri;

  Weather.rain.name = name2;
  Weather.rain.description = description2;
  Weather.rain.image = rainImageUri;

  Weather.cloud.name = name3;
  Weather.cloud.description = description3;
  Weather.cloud.image = cloudyImageUri;

  Weather.snow.name = name4;
  Weather.snow.description = description4;
  Weather.snow.image = snowImageUri;

  console.log(Weather);

  function openNewWindow(url: string): void {
    window.open(url, '_blank', `noopener,noreferrer,height=600,width=800`);
  }

  const uploadToIpfs = async () => {
    setIpfsing(true);
    const uploadUrl = await storage.uploadBatch([file1, file2, file3, file4]);
    alert(uploadUrl);
    setIpfsUrlArray(uploadUrl);
    setSunImageUri(storage.resolveScheme(uploadUrl[0]));
    setRainImageUri(storage.resolveScheme(uploadUrl[1]));
    setCloudImageUri(storage.resolveScheme(uploadUrl[2]));
    setSnowImageUri(storage.resolveScheme(uploadUrl[3]));
    setIpfsing(false);
  };

  const addProperty = () => {
    setProperties((properties) => [
      ...properties,
      {
        trait_type: '',
        value: '',
      },
    ]);
  };

  const handleClick = async () => {
    setActivating(true);
    try {
      const response = await fetch('http://152.69.231.140:1323/wdnfts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(Weather),
      });
      const data = await response.json();
      setMessage(data);
      setActivating(false);
    } catch (error) {
      setMessage('Error: ' + error);
    }
  };

  const handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setLocation(event.target.value);
    const selectedLocation = props.location.find(
      (loc) => loc.name === event.target.value
    );
    if (selectedLocation) {
      Weather.locationId = selectedLocation.locationID.toString();
      Weather.sun.attributes[0].value = selectedLocation.name;
      Weather.sun.attributes[1].value = selectedLocation.latitude.toString();
      Weather.sun.attributes[2].value = selectedLocation.longitude.toString();
      Weather.rain.attributes[0].value = selectedLocation.name;
      Weather.rain.attributes[1].value = selectedLocation.latitude.toString();
      Weather.rain.attributes[2].value = selectedLocation.longitude.toString();
      Weather.cloud.attributes[0].value = selectedLocation.name;
      Weather.cloud.attributes[1].value = selectedLocation.latitude.toString();
      Weather.cloud.attributes[2].value = selectedLocation.longitude.toString();
      Weather.snow.attributes[0].value = selectedLocation.name;
      Weather.snow.attributes[1].value = selectedLocation.latitude.toString();
      Weather.snow.attributes[2].value = selectedLocation.longitude.toString();
    }
  };

  const handleNameChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setName1(event.target.value);
  };

  const handleDesciptionChange1 = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.preventDefault();
    setDescription1(event.target.value);
  };

  const handleNameChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setName2(event.target.value);
  };

  const handleDesciptionChange2 = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.preventDefault();
    setDescription2(event.target.value);
  };

  const handleNameChange3 = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setName3(event.target.value);
  };

  const handleDesciptionChange3 = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.preventDefault();
    setDescription3(event.target.value);
  };

  const handleNameChange4 = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setName4(event.target.value);
  };

  const handleDesciptionChange4 = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.preventDefault();
    setDescription4(event.target.value);
  };

  return (
    <div>
      <CreatePageWrapper>
        <CreateView>
          <Title>Create New Weather DNFT</Title>
          <Box>
            <FieldTitle>Set Location</FieldTitle>
            <Helper className='mb-4'>
              Enter the location so that your DNFT knows what local weather it
              will follow
            </Helper>
            <FormControl fullWidth className='mt-4'>
              <InputLabel id='demo-simple-select-label'>Location</InputLabel>
              <Select
                labelId='demo-simple-select-label'
                id='demo-simple-select'
                value={location}
                label='Location'
                onChange={handleLocationChange}
              >
                {props.location.map((location) => (
                  <MenuItem key={location.value} value={location.name}>
                    {location.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FieldTitle>Image setting by weather</FieldTitle>
            <Helper>
              File types supported: JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV,
              OGG, GLB, GLTF. Max size: 100 MB
            </Helper>
            <Helper>It is stored in ipfs of thirdweb.</Helper>

            <div className='flex mb-2 mt-4'>
              <span className='text-3xl mr-3'>☀️</span>
              <Input
                type='file'
                className='w-full'
                onChange={(e) => {
                  if (e.target.files) {
                    setFile1(e.target.files[0]);
                  }
                }}
              />
            </div>
            <TextField
              fullWidth
              label='Sunny Weather DNFT-name'
              margin='dense'
              id='token-name'
              onChange={handleNameChange1}
            ></TextField>
            <TextField
              multiline
              fullWidth
              label='Sunny Weather DNFT-description'
              rows={2}
              margin='dense'
              id='description'
              onChange={handleDesciptionChange1}
            ></TextField>

            <div className='flex mb-2 mt-4'>
              <span className='text-3xl mr-3'>🌧️</span>
              <Input
                type='file'
                className='w-full'
                onChange={(e) => {
                  if (e.target.files) {
                    setFile2(e.target.files[0]);
                  }
                }}
              />
            </div>
            <TextField
              fullWidth
              label='Rainy Weather DNFT-name'
              margin='dense'
              id='token-name'
              onChange={handleNameChange2}
            ></TextField>
            <TextField
              multiline
              fullWidth
              label='Rainy Weather DNFT-description'
              rows={2}
              margin='dense'
              id='description'
              onChange={handleDesciptionChange2}
            ></TextField>

            <div className='flex mb-2 mt-4'>
              <span className='text-3xl mr-3'>☁️</span>
              <Input
                type='file'
                className='w-full'
                onChange={(e) => {
                  if (e.target.files) {
                    setFile3(e.target.files[0]);
                  }
                }}
              />
            </div>
            <TextField
              fullWidth
              label='Cloudy Weather DNFT-name'
              margin='dense'
              id='token-name'
              onChange={handleNameChange3}
            ></TextField>
            <TextField
              multiline
              fullWidth
              label='Cloudy Weather DNFT-description'
              rows={2}
              margin='dense'
              id='description'
              onChange={handleDesciptionChange3}
            ></TextField>

            <div className='flex mb-2 mt-4'>
              <span className='text-3xl mr-3'>❄️</span>
              <Input
                type='file'
                className='w-full'
                onChange={(e) => {
                  if (e.target.files) {
                    setFile4(e.target.files[0]);
                  }
                }}
              />
            </div>
            <TextField
              fullWidth
              label='Snow Weather DNFT-name'
              margin='dense'
              id='token-name'
              onChange={handleNameChange4}
            ></TextField>
            <TextField
              multiline
              fullWidth
              label='Snow Weather DNFT-description'
              rows={2}
              margin='dense'
              id='description'
              onChange={handleDesciptionChange4}
              className='mb-7'
            ></TextField>

            <Button onClick={uploadToIpfs} variant='outlined' fullWidth>
              {ipfsing ? (
                // <LoadingOverlay spinner text='Loading your content...' />
                <Image alt='Loading' src='/123.gif' width={30} height={30} />
              ) : (
                <>Upload to IPFS</>
              )}
            </Button>

            <FieldTitle className='flex'>
              {sunImageUri ? (
                <>IPFS URLs have been created.</>
              ) : (
                <> Create IPFS URLs by clicking the button above ⬆️.</>
              )}
            </FieldTitle>
            <div className='w-100%'>
              <UriHelper>
                Sunny Image IPFS URI:{' '}
                {sunImageUri ? (
                  <Link
                    href='#'
                    underline='always'
                    onClick={() => openNewWindow(sunImageUri)}
                  >
                    {sunImageUri}
                  </Link>
                ) : (
                  <></>
                )}
              </UriHelper>
              <UriHelper>
                Rainy Image IPFS URI:{' '}
                {rainImageUri ? (
                  <Link
                    href='#'
                    underline='always'
                    onClick={() => openNewWindow(rainImageUri)}
                  >
                    {rainImageUri}
                  </Link>
                ) : (
                  <></>
                )}
              </UriHelper>
              <UriHelper>
                Cloudy Image IPFS URI:{' '}
                {cloudyImageUri ? (
                  <Link
                    href='#'
                    underline='always'
                    onClick={() => openNewWindow(cloudyImageUri)}
                  >
                    {cloudyImageUri}
                  </Link>
                ) : (
                  <></>
                )}
              </UriHelper>
              <UriHelper>
                Snow Image IPFS URI:{' '}
                {snowImageUri ? (
                  <Link
                    href='#'
                    underline='always'
                    onClick={() => openNewWindow(snowImageUri)}
                  >
                    {snowImageUri}
                  </Link>
                ) : (
                  <></>
                )}
              </UriHelper>
            </div>

            <CreateButtonView className='flex mb-4'>
              <button
                onClick={handleClick}
                disabled={sunImageUri ? false : true}
                type='button'
                className=' text-gray-900 bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-10 py-2.5  place-items-center inline-flex  dark:focus:ring-gray-500 flex-1 mb-2'
              >
                <svg
                  className='w-4 h-4 mr-2 mx-40 text-[#626890]'
                  aria-hidden='true'
                  focusable='false'
                  data-prefix='fab'
                  data-icon='ethereum'
                  role='img'
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 320 512'
                >
                  <path
                    fill='currentColor'
                    d='M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z'
                  ></path>
                </svg>
                Create Weather DNFT
              </button>
            </CreateButtonView>
          </Box>

          <div>
            <FlipCard>
              <FrontCard isCardFlipped={message}>
                <LoadingOverlay visible={activating} loader={customLoader} />
                <div style={{ padding: 24 }}>
                  <div className='flex'>
                    <Image
                      src={sunImageUri ? sunImageUri : '/nft.png'}
                      width='125'
                      height='125'
                      alt='RainbowKit Demo NFT'
                      style={{ borderRadius: 8 }}
                    />
                    <Image
                      className='ml-4'
                      src={rainImageUri ? rainImageUri : '/nft.png'}
                      width='125'
                      height='125'
                      alt='RainbowKit Demo NFT'
                      style={{ borderRadius: 8 }}
                    />
                    <Image
                      className='ml-4'
                      src={cloudyImageUri ? cloudyImageUri : '/nft.png'}
                      width='125'
                      height='125'
                      alt='RainbowKit Demo NFT'
                      style={{ borderRadius: 8 }}
                    />
                    <Image
                      className='ml-4'
                      src={snowImageUri ? snowImageUri : '/nft.png'}
                      width='125'
                      height='125'
                      alt='RainbowKit Demo NFT'
                      style={{ borderRadius: 8 }}
                    />{' '}
                  </div>
                  <div className='flex'>
                    <h1 style={{ marginTop: 10 }} className='flex-1 ml-6'>
                      Sunny NFT
                    </h1>
                    <h1 style={{ marginTop: 10 }} className='flex-1 ml-10'>
                      Rainy NFT
                    </h1>
                    <h1 style={{ marginTop: 10 }} className='flex-1 ml-9'>
                      Cloudy NFT
                    </h1>
                    <h1 style={{ marginTop: 10 }} className='flex-1 ml-11'>
                      Snow NFT
                    </h1>
                  </div>{' '}
                  <h1 style={{ marginTop: 24 }}>Location: {location}</h1>{' '}
                  <h1 style={{ marginTop: 10 }}>Owner: {session?.address}</h1>
                </div>
              </FrontCard>
              <BackCard isCardFlipped={message}>
                <div style={{ padding: 24 }}>
                  <h1
                    style={{ marginTop: 5, marginBottom: 15 }}
                    className='text-3xl'
                  >
                    Weather Dynamic NFT Minted!
                  </h1>
                  <p style={{ marginBottom: 6 }}>
                    Your NFT will show up in your wallet in the next few
                    minutes.
                  </p>
                  <p style={{ marginBottom: 6 }}>Nonce: {message?.nonce}</p>
                  <p style={{ marginBottom: 6 }}>Gas: {message?.gas}</p>
                  <p style={{ marginBottom: 10 }}>tx_Hash: {message?.hash}</p>
                  <p style={{ marginBottom: 6 }}>
                    View on{' '}
                    <Link
                      href='#'
                      color='inherit'
                      underline='always'
                      onClick={() =>
                        openNewWindow(
                          `https://mumbai.polygonscan.com/tx/${message?.hash}`
                        )
                      }
                    >
                      Etherscan
                    </Link>
                  </p>
                  <p>
                    View on{' '}
                    <Link
                      href='#'
                      color='inherit'
                      underline='always'
                      onClick={() =>
                        openNewWindow(
                          `https://testnets.opensea.io/assets/mumbai/0x1077a33ED9aDD3d55aE3ef66C28b9638B9611C1d/${tokenNum}`
                        )
                      }
                    >
                      OpenSea
                    </Link>
                  </p>
                </div>
              </BackCard>
            </FlipCard>
          </div>
        </CreateView>
      </CreatePageWrapper>
    </div>
  );
};

export default Create;

const CreatePageWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const CreateView = styled.div`
  width: 100%;
  max-width: 640px;
  padding: 24px;
`;

const Title = styled.div`
  font-size: 40px;
  font-weight: 800;
  margin-top: 32px;
`;

const FieldTitle = styled.div`
  font-size: 18px;
  font-weight: 800;
  margin-top: 20px;
  margin-bottom: 4px;
`;

const PropertyBox = styled.div`
  margin-bottom: 8px;
`;

const PropertyRow = styled.div`
  display: flex;
  margin-top: 8px;
`;

const PropertyKeyField = styled(TextField)`
  flex: 1;
  margin-right: 4px;
`;

const PropertyValueField = styled(TextField)`
  flex: 2;
`;

const PropertyValueFieldL = styled(TextField)`
  flex: 1;
`;

const CreateButtonView = styled.div`
  margin-top: 16px;
`;

const Helper = styled.div`
  font-size: 12px;
  color: rgb(112, 122, 131);
  font-weight: 500;
`;

const UriHelper = styled.div`
  font-size: 15px;
  font-weight: 700;
`;

Create.getInitialProps = async function () {
  const res = await fetch('http://152.69.231.140:1323/location');
  const data = await res.json();

  console.log('location data:' + JSON.stringify(data));

  return {
    location: data,
  };
};

const customLoader = (
  <svg
    width='54'
    height='54'
    viewBox='0 0 38 38'
    xmlns='http://www.w3.org/2000/svg'
    stroke={DEFAULT_THEME.colors.blue[6]}
  >
    <g fill='none' fillRule='evenodd'>
      <g transform='translate(1 1)' strokeWidth='2'>
        <circle strokeOpacity='.5' cx='18' cy='18' r='18' />
        <path d='M36 18c0-9.94-8.06-18-18-18'>
          <animateTransform
            attributeName='transform'
            type='rotate'
            from='0 18 18'
            to='360 18 18'
            dur='1s'
            repeatCount='indefinite'
          />
        </path>
      </g>
    </g>
  </svg>
);
