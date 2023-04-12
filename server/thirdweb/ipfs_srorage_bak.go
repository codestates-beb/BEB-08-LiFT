package main

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"mime/multipart"
	"net/http"
	"os"
	"reflect"
	"strings"

	"github.com/joho/godotenv"
	"github.com/thirdweb-dev/go-sdk/v2/thirdweb"
)

type IpfsStorage struct { //ipfsStorage 구조체
	gatewayUrl string       //게이트웨이 uri
	httpClient *http.Client //http client
}

type baseUriWithUris struct {
	baseUri string   //문자열
	uris    []string //문자열 배열
}

type storage interface { //interface storage를 정의했다. 다음 함수들을 가지고 있다.
	Get(ctx context.Context, uri string) ([]byte, error)                                                                   //get을 하기위한 함수
	Upload(ctx context.Context, data map[string]interface{}, contractAddress string, signerAddress string) (string, error) //upload를 위한 함수
	UploadBatch(ctx context.Context, data []map[string]interface{}, fileStartNumber int, contractAddress string, signerAddress string) (*baseUriWithUris, error)
}

var (
	contractAddress = ""
	signerAddress   = ""
)

// 새로운 ipfs Storage에 추가 하기위해 이 함수가 있는 것 같다.
func newIpfsStorage(gatewayUrl string, httpClient *http.Client) *IpfsStorage {
	return &IpfsStorage{
		gatewayUrl: gatewayUrl, //url
		httpClient: httpClient, //httpClient
	}
}

func (ipfs *IpfsStorage) Get(ctx context.Context, uri string) ([]byte, error) {
	gatewayUrl := replaceHashWithGatewayUrl(uri, ipfs.gatewayUrl)
	fmt.Println("gatewayUrl", gatewayUrl)
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, gatewayUrl, nil)
	if err != nil {
		return nil, err
	}
	fmt.Println("req", req)
	resp, err := ipfs.httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	fmt.Println("resp", resp)

	if resp.StatusCode != http.StatusOK {
		return nil, errors.New(fmt.Sprintf("Bad status code, %d", resp.StatusCode))
	}

	body, err := ioutil.ReadAll(resp.Body)
	fmt.Println("body", body)
	if err != nil {
		return nil, err
	}
	return body, nil
}

func (ipfs *IpfsStorage) Upload(ctx context.Context, data map[string]interface{}, contractAddress string, signerAddress string) (string, error) {
	baseUriWithUris, err := ipfs.UploadBatch(ctx, []map[string]interface{}{data}, 0, contractAddress, signerAddress)
	if err != nil {
		return "", err
	}

	baseUri := baseUriWithUris.baseUri + "0"
	return baseUri, nil
}

func (ipfs *IpfsStorage) UploadBatch(ctx context.Context, data []map[string]interface{}, fileStartNumber int, contractAddress string, signerAddress string) (*baseUriWithUris, error) {
	preparedData, err := ipfs.batchUploadProperties(ctx, data)
	if err != nil {
		return nil, err
	}

	dataToUpload := []interface{}{}
	dataValue := reflect.ValueOf(preparedData)
	switch dataValue.Kind() {
	case reflect.Array, reflect.Slice:
		for i := 0; i < dataValue.Len(); i++ {
			jsonData, err := json.Marshal(dataValue.Index(i).Interface())
			if err != nil {
				return nil, err
			}
			dataToUpload = append(dataToUpload, jsonData)
		}
		break
	default:
		return nil, errors.New("data must be an array or slice")
	}

	baseUriWithUris, err := ipfs.uploadBatchWithCid(ctx, dataToUpload, fileStartNumber, contractAddress, signerAddress)
	if err != nil {
		return nil, err
	}

	return baseUriWithUris, nil
}

// returns - map[string]interface{}
func (ipfs *IpfsStorage) batchUploadProperties(ctx context.Context, data []map[string]interface{}) (interface{}, error) {
	sanitizedMetadatas, err := replaceGatewayUrlWithHash(data, "ipfs://", ipfs.gatewayUrl)
	if err != nil {
		return nil, err
	}

	filesToUpload, err := buildFilePropertiesMap(sanitizedMetadatas, []interface{}{})
	if err != nil {
		return nil, err
	}

	if len(filesToUpload) == 0 {
		return sanitizedMetadatas, nil
	}

	baseUriWithUris, err := ipfs.uploadBatchWithCid(ctx, filesToUpload, 0, "", "")
	if err != nil {
		return nil, err
	}

	replacedMetadatas, err := replaceFilePropertiesWithHashes(sanitizedMetadatas, baseUriWithUris.uris)
	if err != nil {
		return nil, err
	}

	return replacedMetadatas, nil
}
func (ipfs *IpfsStorage) uploadBatchWithCid(
	ctx context.Context,
	// data (string | io.Reader)[] - file or JSON string
	data []interface{},
	fileStartNumber int,
	contractAddress string,
	signerAddress string,
) (*baseUriWithUris, error) {
	uploadToken, err := ipfs.getUploadToken(ctx, contractAddress)
	if err != nil {
		return nil, err
	}

	fileNames := []string{}

	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)

	for i, obj := range data {
		if jsonData, ok := obj.([]byte); ok {
			fileName := fmt.Sprintf("%v", i+fileStartNumber)
			fileNames = append(fileNames, fileName)

			part, err := writer.CreateFormFile("file", fmt.Sprintf("files/%v", fileName))
			if err != nil {
				return nil, err
			}

			if _, err := part.Write(jsonData); err != nil {
				return nil, err
			}
		} else if fileData, ok := obj.(io.Reader); ok {
			fileName := fmt.Sprintf("%v", i+fileStartNumber)
			fileNames = append(fileNames, fileName)

			part, err := writer.CreateFormFile("file", fmt.Sprintf("files/%v", fileName))
			if err != nil {
				return nil, err
			}

			_, err = io.Copy(part, fileData)
			if err != nil {
				return nil, err
			}
		} else {
			return nil, errors.New("Data to upload must be either JSON ([]byte) or a file (io.Reader)")
		}
	}

	_ = writer.Close()
	pinataIpfsUrl := ""
	req, err := http.NewRequestWithContext(ctx, "POST", pinataIpfsUrl, body)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Authorization", fmt.Sprintf("Bearer %v", uploadToken))
	req.Header.Set("Content-Type", writer.FormDataContentType())

	if result, err := ipfs.httpClient.Do(req); err != nil {
		return nil, err
	} else {
		if result.StatusCode != http.StatusOK {
			return nil, &failedToUploadError{
				statusCode: result.StatusCode,
				Payload:    data,
			}
		}

		var uploadMeta uploadResponse
		bodyBytes, err := ioutil.ReadAll(result.Body)
		if err != nil {
			return nil, &failedToUploadError{
				statusCode:      result.StatusCode,
				Payload:         data,
				UnderlyingError: err,
			}
		}

		if err := json.Unmarshal(bodyBytes, &uploadMeta); err != nil {
			return nil, &unmarshalError{
				body:            string(bodyBytes),
				typeName:        "UploadResponse",
				UnderlyingError: err,
			}
		}

		baseUri := "ipfs://" + uploadMeta.IpfsHash + "/"

		uris := []string{}
		for _, fileName := range fileNames {
			uri := baseUri + fileName
			uris = append(uris, uri)
		}

		return &baseUriWithUris{
			baseUri: baseUri,
			uris:    uris,
		}, nil
	}
}

// returns - map[string]interface{}
func (ipfs *IpfsStorage) batchUploadProperties(ctx context.Context, data []map[string]interface{}) (interface{}, error) {
	sanitizedMetadatas, err := replaceGatewayUrlWithHash(data, "ipfs://", ipfs.gatewayUrl)
	if err != nil {
		return nil, err
	}

	filesToUpload, err := buildFilePropertiesMap(sanitizedMetadatas, []interface{}{})
	if err != nil {
		return nil, err
	}

	if len(filesToUpload) == 0 {
		return sanitizedMetadatas, nil
	}

	baseUriWithUris, err := ipfs.uploadBatchWithCid(ctx, filesToUpload, 0, "", "")
	if err != nil {
		return nil, err
	}

	replacedMetadatas, err := replaceFilePropertiesWithHashes(sanitizedMetadatas, baseUriWithUris.uris)
	if err != nil {
		return nil, err
	}

	return replacedMetadatas, nil
}

// data - array or map or strings
// Returns []io.Reader files to upload
func buildFilePropertiesMap(data interface{}, files []interface{}) ([]interface{}, error) {
	v := reflect.ValueOf(data)
	switch v.Kind() {
	case reflect.Array, reflect.Slice:
		for i := 0; i < v.Len(); i++ {
			builtFiles, err := buildFilePropertiesMap(v.Index(i).Interface(), files)
			if err != nil {
				return nil, err
			}

			files = builtFiles
		}
		break
	case reflect.Map:
		for _, k := range v.MapKeys() {
			builtFiles, err := buildFilePropertiesMap(v.MapIndex(k).Interface(), files)
			if err != nil {
				return nil, err
			}

			files = builtFiles
		}
		break
	default:
		file, ok := data.(io.Reader)
		if ok {
			files = append(files, file)
		}
	}

	return files, nil
}

func replaceFilePropertiesWithHashes(data interface{}, cids []string) (interface{}, error) {
	v := reflect.ValueOf(data)
	switch v.Kind() {
	case reflect.Array, reflect.Slice:
		updated := []interface{}{}
		for i := 0; i < v.Len(); i++ {
			val, err := replaceFilePropertiesWithHashes(v.Index(i).Interface(), cids)
			if err != nil {
				return nil, err
			}

			updated = append(updated, val)
		}

		return updated, nil
	case reflect.Map:
		updated := map[string]interface{}{}
		for _, k := range v.MapKeys() {
			val, err := replaceFilePropertiesWithHashes(v.MapIndex(k).Interface(), cids)
			if err != nil {
				return nil, err
			}

			updated[k.String()] = val
		}

		return updated, nil
	default:
		_, ok := data.(io.Reader)
		if ok {
			data, cids = cids[0], cids[1:]
		}

		return data, nil
	}
}

func replaceGatewayUrlWithHash(data interface{}, scheme string, gatewayUrl string) (interface{}, error) {
	v := reflect.ValueOf(data)
	switch v.Kind() {
	case reflect.Array, reflect.Slice:
		for i := 0; i < v.Len(); i++ {
			if _, err := replaceGatewayUrlWithHash(v.Index(i), scheme, gatewayUrl); err != nil {
				return nil, err
			}
		}
		break
	case reflect.Map:
		for _, k := range v.MapKeys() {
			if _, err := replaceGatewayUrlWithHash(v.MapIndex(k), scheme, gatewayUrl); err != nil {
				return nil, err
			}
		}
		break
	case reflect.String:
		if strings.Contains(v.String(), gatewayUrl) {
			data = strings.Replace(v.String(), gatewayUrl, scheme, 1)
		}
	}

	return data, nil
}

func replaceHashWithGatewayUrl(ipfsUrl string, gatewayUrl string) string {
	if ipfsUrl == "" {
		return ""
	}

	gateway := gatewayUrl
	if !strings.HasSuffix(gatewayUrl, "/") {
		gateway = gatewayUrl + "/"
	}

	return strings.Replace(ipfsUrl, "ipfs://", gateway, 1)
}

func main() {

	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	sdk, err := thirdweb.NewThirdwebSDK(os.Getenv("NETWORK"), nil)
	if err != nil {
		panic(err)
	}
	fmt.Println("sdk", sdk)

	uris := []string{"http://example.com/image1.jpg", "http://example.com/image2.jpg"}

	baseUriWithUris := baseUriWithUris{
		baseUri: "http://example.com",
		uris:    uris,
	}
	fmt.Println("baseUriWithUris", baseUriWithUris)

	ctx := context.Background()
	ipfsStorage := newIpfsStorage("https://gateway.ipfscdn.io/", http.DefaultClient)
	ipfsTest := "ipfs://QmerEwUkicVJ1yAPh3R2joLGUEu8kum5XSVD6tadWTgetx/0"
	// ipfsTest := "https://gateway.ipfscdn.io/ipfs/QmerEwUkicVJ1yAPh3R2joLGUEu8kum5XSVD6tadWTgetx/0"
	getTest, err := ipfsStorage.Get(ctx, ipfsTest)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("getTest", getTest)
}
