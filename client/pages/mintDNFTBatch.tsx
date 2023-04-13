// import { NextPage } from 'next';
// import React, { useState } from 'react';
// import styled from '@emotion/styled';
// import { Box, Button, TextField } from '@mui/material';
// import { ThirdwebStorage } from '@thirdweb-dev/storage';
// import { useStorageUpload } from '@thirdweb-dev/react';
// //const fs = require('fs');
// import fs from 'fs';
// //import { promises as fs } from 'fs';

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

//   const [files, setFiles] = useState([]);
//   const { mutateAsync: upload } = useStorageUpload();
//   const storage = new ThirdwebStorage();

//   const uploadToIpfs = async () => {
//     const uploadUrl = await storage.uploadBatch([
//       fs.readFileSync('test.jpg'),
//       fs.readFileSync('test1.jpg'),
//       fs.readFileSync('test2.jpg'),
//       fs.readFileSync('test3.jpg'),
//     ]);
//     alert(uploadUrl);
//   };

//   //   (async () => {
//   //     const upload = await storage.uploadBatch([
//   //       fs.readFileSync("test.jpg"),
//   //       fs.readFileSync("test1.jpg"),
//   //       fs.readFileSync("test2.jpg"),
//   //       fs.readFileSync("test3.jpg"),
//   //     ]);
//   //     console.log(`Gateway URL 1 - ${storage.resolveScheme(upload[0])}`);
//   //     console.log(`Gateway URL 2 - ${storage.resolveScheme(upload[1])}`);
//   //     console.log(`Gateway URL 2 - ${storage.resolveScheme(upload[2])}`);
//   //     console.log(`Gateway URL 2 - ${storage.resolveScheme(upload[3])}`);
//   //   })();

//   const handleFileUpload = (event) => {
//     const fileArray = Array.from(event.target.files);
//     setFiles(fileArray);

//     // Write the files to disk with the specified file names
//     fileArray.forEach((file, index) => {
//       const reader = new FileReader();
//       reader.onload = () => {
//         fs.writeFile(`test${index}.jpg`, Buffer.from(reader.result), (err) => {
//           if (err) {
//             console.error(err);
//           }
//         });
//       };
//       reader.readAsArrayBuffer(file);
//     });
//   };

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
//           <Title>Create New Dynamic NFT</Title>
//           <Box>
//             <div>
//               <input
//                 type='file'
//                 multiple
//                 id='file-input'
//                 onChange={handleFileUpload}
//               />
//               <button onClick={getStaticProps}>Upload</button>
//             </div>

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

// export async function getStaticProps() {
//   //const fileNames = fs.readFileSync('test.jpg');
//   const storage = new ThirdwebStorage();

//   const uploadToIpfs = async () => {
//     const uploadUrl = await storage.uploadBatch([
//       fs.readFileSync('test.jpg'),
//       fs.readFileSync('test1.jpg'),
//       fs.readFileSync('test2.jpg'),
//       fs.readFileSync('test3.jpg'),
//     ]);
//     alert(uploadUrl);
//   };

//   return {
//     props: {
//       uploadToIpfs,
//     },
//   };
// }

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
