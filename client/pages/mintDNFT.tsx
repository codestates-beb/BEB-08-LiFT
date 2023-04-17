import { NextPage } from 'next';
import Image from 'next/image';
import React, { useState } from 'react';
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
import LoadingOverlay from 'react-loading-overlay-ts';

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
  sun: Weather;
  rain: Weather;
  cloud: Weather;
  snow: Weather;
}

const Weather: WeatherData = {
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

interface Property {
  trait_type: string;
  value: string;
}
// https://gateway.ipfscdn.io/ipfs/QmNTP7UejsrZpZTJfh6pwjMD6bajZh2t2iAZagPqNsGZwm/images.jpeg
// sun, rain, cloudy, snow => 0, 1, 2, 3
// seoul: 37.5 126.9 / london: 36.9 -93.9 new york 40.7 -74

const Create: NextPage = () => {
  const [ImageUri, setImageUri] = useState('https://example.com/snow.jpg');

  const [properties, setProperties] = useState<Property[]>([
    {
      trait_type: '',
      value: '',
    },
  ]);

  const [message, setMessage] = useState('');
  const [activating, setActivating] = useState(false);

  const [location, setLocation] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

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
    setActivating(true);

    const uploadUrl = await storage.uploadBatch([file1, file2, file3, file4]);
    alert(uploadUrl);
    setIpfsUrlArray(uploadUrl);
    setSunImageUri(storage.resolveScheme(uploadUrl[0]));
    setRainImageUri(storage.resolveScheme(uploadUrl[1]));
    setCloudImageUri(storage.resolveScheme(uploadUrl[2]));
    setSnowImageUri(storage.resolveScheme(uploadUrl[3]));
    setActivating(false);
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

  const handlePropertyChange =
    (index: number, key: keyof Property) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setProperties((properties) => {
        const updatedProperties = [...properties];
        updatedProperties[index][key] = event.target.value;
        return updatedProperties;
      });
    };

  const handleClick = async () => {
    try {
      const response = await fetch('http://152.69.231.140:1323/mnfts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(Weather),
      });
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage('Error: ' + error.message);
    }
  };

  const handleLocationChange = (event) => {
    event.preventDefault();
    setLocation(event.target.value);
    let latitude, longitude;
    if (event.target.value === 'Seoul') {
      latitude = '37.5519';
      longitude = '126.9918';
    } else if (event.target.value === 'London') {
      latitude = '51.5072';
      longitude = '0.1276';
    } else {
      latitude = '40.7128';
      longitude = '74.0060';
    }
    console.log('wefwe' + location); //  한박자 늦게 입력값이 저장됨
    Weather.sun.attributes[0].value = event.target.value;
    Weather.sun.attributes[1].value = latitude;
    Weather.sun.attributes[2].value = longitude;
    Weather.rain.attributes[0].value = event.target.value;
    Weather.rain.attributes[1].value = latitude;
    Weather.rain.attributes[2].value = longitude;
    Weather.cloud.attributes[0].value = event.target.value;
    Weather.cloud.attributes[1].value = latitude;
    Weather.cloud.attributes[2].value = longitude;
    Weather.snow.attributes[0].value = event.target.value;
    Weather.snow.attributes[1].value = latitude;
    Weather.snow.attributes[2].value = longitude;
  };

  const handleNameChange1 = (event) => {
    event.preventDefault();
    setName1(event.target.value);
  };

  const handleDesciptionChange1 = (event) => {
    event.preventDefault();
    setDescription1(event.target.value);
  };

  const handleNameChange2 = (event) => {
    event.preventDefault();
    setName2(event.target.value);
  };

  const handleDesciptionChange2 = (event) => {
    event.preventDefault();
    setDescription2(event.target.value);
  };

  const handleNameChange3 = (event) => {
    event.preventDefault();
    setName3(event.target.value);
  };

  const handleDesciptionChange3 = (event) => {
    event.preventDefault();
    setDescription3(event.target.value);
  };

  const handleNameChange4 = (event) => {
    event.preventDefault();
    setName4(event.target.value);
  };

  const handleDesciptionChange4 = (event) => {
    event.preventDefault();
    setDescription4(event.target.value);
  };

  return (
    <div>
      <LoadingOverlay
        active={activating}
        spinner
        text='Uploading to thridweb IPFS...'
      >
        <CreatePageWrapper>
          <CreateView>
            <Title>Create New Weather DNFT</Title>
            <Box>
              <FieldTitle>Set Location</FieldTitle>
              <Helper>
                Enter the location so that your DNFT knows what local weather it
                will follow
              </Helper>
              <FormControl fullWidth className='mt-8'>
                <InputLabel id='demo-simple-select-label'>Location</InputLabel>
                <Select
                  labelId='demo-simple-select-label'
                  id='demo-simple-select'
                  value={location}
                  label='Location'
                  onChange={handleLocationChange}
                >
                  <MenuItem value='Seoul'>Seoul</MenuItem>
                  <MenuItem value='London'>London</MenuItem>
                  <MenuItem value='New York'>New York</MenuItem>
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
              ></TextField>

              <Button
                onClick={uploadToIpfs}
                variant='outlined'
                fullWidth
                className='mt-5'
              >
                {activating ? (
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

              {/* <FieldTitle>Token Name</FieldTitle>
            <Helper>
              Please enter a name for a DNFT that covers the above
            </Helper>
            <TextField
              required
              fullWidth
              margin='dense'
              id='token-name'
            ></TextField>

            <FieldTitle>Token Desription</FieldTitle>
            <Helper>
              The description will be included on the item's detail page
              underneath its image. Markdown syntax is supported.
            </Helper>
            <TextField
              required
              multiline
              rows={3}
              fullWidth
              margin='dense'
              id='description'
            ></TextField>

            <FieldTitle>Properties</FieldTitle>
            <Helper>Textual traits that show up as rectangles</Helper>
            <PropertyBox>
              {properties.map(({ trait_type, value }, index) => (
                <PropertyRow key={`property-${index}`}>
                  <PropertyKeyField
                    id={`property-${index}-key`}
                    label='key'
                    value={trait_type}
                    onChange={handlePropertyChange(index, 'trait_type')}
                  />
                  <PropertyValueField
                    id={`property-${index}-value`}
                    label='value'
                    value={value}
                    onChange={handlePropertyChange(index, 'value')}
                  />
                </PropertyRow>
              ))}
            </PropertyBox>
            <Button variant='outlined' fullWidth onClick={addProperty}>
              Add Property
            </Button> */}
              <CreateButtonView className='flex'>
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
              <span>{message}</span>
            </Box>
          </CreateView>
        </CreatePageWrapper>
      </LoadingOverlay>
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

{
  /* <div className='flex mt-2'>
<TextField
  className='flex-1 mr-1'
  label='latitude'
  id='latitude'
  onChange={handleLatitudeChange}
/>
<TextField
  className='flex-1 ml-1'
  label='longitude'
  id='longitude'
  onChange={handleLongitudeChange}
/>
</div> */
}
