package handlers

import (
	"database/sql"
	s "echo-dnft/server"
	"fmt"
	"log"
	"net/http"
	"os"
	"reflect"

	_ "github.com/go-sql-driver/mysql"
	"github.com/labstack/echo/v4"
	_ "github.com/mattn/go-sqlite3"
	"github.com/thirdweb-dev/go-sdk/thirdweb"
)

type WeatherRef struct {
	ID         int     `json:"id"`
	LocationID int     `json:"locationID"`
	Name       string  `json:"name"`
	Latitude   float64 `json:"latitude"`
	Longitude  float64 `json:"longitude"`
}

type GetHandler struct {
	server *s.Server
	db     *sql.DB
}

func NewGetHandler(server *s.Server) *GetHandler {
	return &GetHandler{server: server}
}

func (g *GetHandler) GetHandle(c echo.Context) error {
	fmt.Println("test")
	sdk, err := thirdweb.NewThirdwebSDK(os.Getenv("NETWORK"), nil)
	if err != nil {
		panic(err)
	}
	fmt.Println("sdk", sdk)
	contract_address := os.Getenv("CONTRACTS")
	fmt.Println("contract_address", contract_address)
	nft, err := sdk.GetNFTCollection(contract_address)

	fmt.Println(reflect.TypeOf(nft))
	fmt.Println("nft", nft)

	if err != nil {
		panic(err)
	}
	owner := os.Getenv("WALLET_ADDRESS")
	fmt.Println("owner", owner)

	return c.JSON(http.StatusOK, nft)

}

func (g *GetHandler) GetMyPage(c echo.Context) error {
	fmt.Println("test")
	return c.JSON(http.StatusOK, "Hello")

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
		log.Fatal(err)
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
