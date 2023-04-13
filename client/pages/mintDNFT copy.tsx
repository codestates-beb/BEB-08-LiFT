// import { NextPage } from 'next';
// import React, { useState } from 'react';
// import styled from '@emotion/styled';
// import { Box, Button, TextField } from '@mui/material';
// import { ThirdwebStorage } from '@thirdweb-dev/storage';
// import { useStorageUpload } from '@thirdweb-dev/react';
// import { Input } from '@mantine/core';

// interface Property {
//   trait_type: string;
//   value: string;
// }

// const Create: NextPage = (props) => {
//   const [properties, setProperties] = useState<Property[]>([
//     {
//       trait_type: '',
//       value: '',
//     },
//   ]);

//   const [latitude, setLatitude] = useState<Property[]>([
//     {
//       trait_type: 'latitude',
//       value: '',
//     },
//   ]);

//   const [longitude, setLongitude] = useState<Property[]>([
//     {
//       trait_type: 'longitude',
//       value: '',
//     },
//   ]);

//   const [file1, setFile1] = useState([]);
//   const [file2, setFile2] = useState([]);
//   const [file3, setFile3] = useState([]);
//   const [file4, setFile4] = useState([]);
//   const storage = new ThirdwebStorage();

//   const addProperty = () => {
//     setProperties((properties) => [
//       ...properties,
//       {
//         trait_type: '',
//         value: '',
//       },
//     ]);
//   };

//   console.log(properties);
//   console.log(JSON.stringify(properties));

//   const handlePropertyChange =
//     (index: number, key: keyof Property) =>
//     (event: React.ChangeEvent<HTMLInputElement>) => {
//       setProperties((properties) => {
//         const updatedProperties = [...properties];
//         updatedProperties[index][key] = event.target.value;
//         return updatedProperties;
//       });
//     };

//   return (
//     <div>
//       <CreatePageWrapper>
//         <CreateView>
//           <Title>Create New Weather DNFT</Title>
//           <Box>
//             <div className='flex'>
//               <span className=''>☀️</span>
//               <Input
//                 type='file'
//                 className='mb-2'
//                 onChange={(e) => {
//                   if (e.target.file1) {
//                     setFile1(e.target.file1[0]);
//                   }
//                 }}
//               />
//             </div>
//             <Input
//               className='mb-2'
//               type='file'
//               onChange={(e) => {
//                 if (e.target.file2) {
//                   setFile1(e.target.file2[0]);
//                 }
//               }}
//             />
//             <Input
//               type='file'
//               className='mb-2'
//               onChange={(e) => {
//                 if (e.target.file3) {
//                   setFile1(e.target.file3[0]);
//                 }
//               }}
//             />
//             <Input
//               type='file'
//               onChange={(e) => {
//                 if (e.target.file4) {
//                   setFile1(e.target.file4[0]);
//                 }
//               }}
//             />

//             <FieldTitle>Image URL</FieldTitle>
//             <Helper>
//               File types supported: JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV,
//               OGG, GLB, GLTF. Max size: 100 MB
//             </Helper>
//             <Helper>It is stored in ipfs of thirdweb.</Helper>
//             <TextField
//               required
//               fullWidth
//               margin='dense'
//               id='image-url'
//             ></TextField>

//             <FieldTitle>Token Name</FieldTitle>
//             <TextField
//               required
//               fullWidth
//               margin='dense'
//               id='token-name'
//             ></TextField>

//             <FieldTitle>Token Desription</FieldTitle>
//             <Helper>
//               The description will be included on the item's detail page
//               underneath its image. Markdown syntax is supported.
//             </Helper>
//             <TextField
//               required
//               multiline
//               rows={3}
//               fullWidth
//               margin='dense'
//               id='description'
//             ></TextField>

//             <FieldTitle>Properties</FieldTitle>
//             <Helper>Textual traits that show up as rectangles</Helper>
//             <PropertyBox>
//               {properties.map(({ trait_type, value }, index) => (
//                 <PropertyRow key={`property-${index}`}>
//                   <PropertyKeyField
//                     id={`property-${index}-key`}
//                     label='key'
//                     value={trait_type}
//                     onChange={handlePropertyChange(index, 'trait_type')}
//                   />
//                   <PropertyValueField
//                     id={`property-${index}-value`}
//                     label='value'
//                     value={value}
//                     onChange={handlePropertyChange(index, 'value')}
//                   />
//                 </PropertyRow>
//               ))}
//             </PropertyBox>
//             <Button variant='outlined' fullWidth onClick={addProperty}>
//               Add Property
//             </Button>
//             <CreateButtonView>
//               <Button variant='contained' fullWidth size='large'>
//                 Create
//               </Button>
//             </CreateButtonView>
//           </Box>
//         </CreateView>
//       </CreatePageWrapper>
//     </div>
//   );
// };

// export default Create;

// const CreatePageWrapper = styled.div`
//   display: flex;
//   justify-content: center;
//   width: 100%;
// `;

// const CreateView = styled.div`
//   width: 100%;
//   max-width: 640px;
//   padding: 24px;
// `;

// const Title = styled.div`
//   font-size: 40px;
//   font-weight: 800;
//   margin-top: 32px;
// `;

// const FieldTitle = styled.div`
//   font-size: 18px;
//   font-weight: 800;
//   margin-top: 20px;
//   margin-bottom: 4px;
// `;

// const PropertyBox = styled.div`
//   margin-bottom: 8px;
// `;

// const PropertyRow = styled.div`
//   display: flex;
//   margin-top: 8px;
// `;

// const PropertyKeyField = styled(TextField)`
//   flex: 1;
//   margin-right: 4px;
// `;

// const PropertyValueField = styled(TextField)`
//   flex: 2;
// `;

// const CreateButtonView = styled.div`
//   margin-top: 16px;
// `;

// const Helper = styled.div`
//   font-size: 12px;
//   color: rgb(112, 122, 131);
//   font-weight: 500;
// `;

// {/* <PropertyBox className='flex'>
//               <div>
//                 <PropertyKeyField
//                   id={`property-key`}
//                   label='key'
//                   value= 'latitude'
//                   onChange={setLatitude('trait_type')}
//                 />
//                 <PropertyValueField
//                   id={`property-${index}-value`}
//                   label='value'
//                   value={value}
//                   onChange={handlePropertyChange(index, 'value')}
//                 />
//               </div>
//               <div>
//                 <PropertyKeyField
//                   id={`property-${index}-key`}
//                   label='key'
//                   value={trait_type}
//                   onChange={handlePropertyChange(index, 'trait_type')}
//                 />
//                 <PropertyValueField
//                   id={`property-${index}-value`}
//                   label='value'
//                   value={value}
//                   onChange={handlePropertyChange(index, 'value')}
//                 />
//               </div>
//             </PropertyBox> */}
