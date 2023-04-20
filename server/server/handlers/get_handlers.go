package handlers

import (
	"database/sql"
	s "echo-dnft/server"
	"fmt"
	"net/http"
	"os"
	"reflect"

	_ "github.com/go-sql-driver/mysql"
	"github.com/labstack/echo/v4"
	_ "github.com/mattn/go-sqlite3"
)

type WeatherRef struct {
	ID         int     `json:"id"`
	LocationID int     `json:"locationID"`
	Name       string  `json:"name"`
	Latitude   float64 `json:"latitude"`
	Longitude  float64 `json:"longitude"`
}

type NFTMain struct {
	ID                   int    `json:"id"`
	UserID               int    `json:"user_id"`
	TokenID              int    `json:"token_id"`
	OwnerAddress         string `json:"owner_address"`
	Name                 string `json:"name"`
	Description          string `json:"description"`
	IpfsUri              string `json:"ipfs_url"`
	nft_contract_address string `json:"nft_contract_address"`
}

type MyPageOwner struct {
	OwnerAddress string `json:"owner_address"`
}

type MyPageObject struct {
	Name               string `json:"user_name"`
	OwnerAddress       string `json:"user_owner_address"`
	OwnerDescription   string `json:"user_description"`
	TokenID            string `json:"nft_token_id"`
	NFTName            string `json:"nft_name"`
	NFTDescription     string `json:"nft_description"`
	IpfsUri            string `json:"nft_ipfs_url"`
	NFTContractAddress string `json:"nft_contract_address"`
}

type GetHandler struct {
	server *s.Server
	db     *sql.DB
}

func NewGetHandler(server *s.Server) *GetHandler {
	return &GetHandler{server: server}
}

func (g *GetHandler) GetMainPage(c echo.Context) error {

	var nftList []NFTMain

	user := os.Getenv("user")
	password := os.Getenv("password")

	//db url 설정
	db_url := fmt.Sprintf("%s:%s@tcp(152.69.231.140:3306)/lift", user, password)
	db, err := sql.Open("mysql", db_url)

	if err != nil {
		fmt.Println(err)
	}
	defer db.Close()
	//QueryRow는 결과가 여러 행인 경우 에러반환, 한개 결과값만 받을 수 있음
	rows, err := db.Query("SELECT * FROM nft")
	if err != nil {
		fmt.Println(err)
	}
	for rows.Next() {
		var nftMain NFTMain
		err := rows.Scan(&nftMain.ID, &nftMain.UserID, &nftMain.TokenID, &nftMain.OwnerAddress, &nftMain.Name, &nftMain.Description, &nftMain.IpfsUri, &nftMain.nft_contract_address)
		if err != nil {
			fmt.Println(err)
		}
		nftList = append(nftList, nftMain)
	}

	if err := rows.Err(); err != nil {
		fmt.Println(err)
	}
	fmt.Println("nftList", nftList)

	return c.JSON(http.StatusOK, nftList)
}

func (g *GetHandler) GetMyPage(c echo.Context) error {

	var owner MyPageOwner
	var myPageObj MyPageObject
	c.Bind(&owner)
	fmt.Println("owner", owner)
	fmt.Println("owner", owner.OwnerAddress)
	fmt.Println("owner", reflect.TypeOf(owner))

	user := os.Getenv("user")
	password := os.Getenv("password")

	//db url 설정
	db_url := fmt.Sprintf("%s:%s@tcp(152.69.231.140:3306)/lift", user, password)
	db, err := sql.Open("mysql", db_url)

	if err != nil {
		fmt.Println(err)
	}
	defer db.Close()
	fmt.Println("test1")
	rows, err := db.Query("select user.name, user.owner_address, user.description, nft.token_id, nft.name, nft.description, nft.ipfs_url, nft.nft_contract_address from user join nft on user.owner_address = nft.owner_address where user.owner_address = ?", owner.OwnerAddress)
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println("myPageObj", myPageObj)
	fmt.Println("myPageObj", &myPageObj)
	fmt.Println("test2")
	for rows.Next() {
		err := rows.Scan(&myPageObj.Name, &myPageObj.OwnerAddress, &myPageObj.OwnerDescription, &myPageObj.TokenID, &myPageObj.NFTName, &myPageObj.NFTDescription, &myPageObj.IpfsUri, &myPageObj.NFTContractAddress)
		if err != nil {
			fmt.Println(err)
		}

	}
	fmt.Println("myPageObj", myPageObj)

	return c.JSON(http.StatusOK, myPageObj)

}

func (g *GetHandler) GetDetail(c echo.Context) error {
	var nftMain NFTMain
	num := c.Param("num")
	user := os.Getenv("user")
	password := os.Getenv("password")
	db_url := fmt.Sprintf("%s:%s@tcp(152.69.231.140:3306)/lift", user, password)
	db, err := sql.Open("mysql", db_url)

	if err != nil {
		fmt.Println(err)
	}
	defer db.Close()

	rows, err := db.Query("SELECT * from nft where id = ?", num)
	if err != nil {
		fmt.Println(err)
	}
	for rows.Next() {

		err := rows.Scan(&nftMain.ID, &nftMain.UserID, &nftMain.TokenID, &nftMain.OwnerAddress, &nftMain.Name, &nftMain.Description, &nftMain.IpfsUri, &nftMain.nft_contract_address)
		if err != nil {
			fmt.Println(err)
		}

	}
	fmt.Println("nftMain", nftMain)

	return c.JSON(http.StatusOK, nftMain)

}

func (g *GetHandler) GetMyWeather(c echo.Context) error {

	//user, pw 정보 가져오기
	user := os.Getenv("user")
	password := os.Getenv("password")

	//db url 설정
	db_url := fmt.Sprintf("%s:%s@tcp(152.69.231.140:3306)/lift", user, password)
	fmt.Println("db_url", db_url)

	db, err := sql.Open("mysql", db_url)
	if err != nil {
		fmt.Println(err)
	}
	defer db.Close()
	fmt.Println("db", db)

	rows, err := db.Query("SELECT id, locationID, name, latitude, longitude FROM Weather")
	if err != nil {
		return err
	}

	fmt.Println("rows", rows)
	defer rows.Close()

	var weatherList []WeatherRef

	for rows.Next() {
		var weather WeatherRef
		err := rows.Scan(&weather.ID, &weather.LocationID, &weather.Name, &weather.Latitude, &weather.Longitude)
		if err != nil {
			return err
		}
		weatherList = append(weatherList, weather)
	}
	if err := rows.Err(); err != nil {
		return err
	}

	return c.JSON(http.StatusOK, weatherList)

}

// func (g *GetHandler) Search(c echo.Context) error {

// }
