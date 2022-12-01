package config

import (
	"log"

	"github.com/spf13/viper"
)

type Config struct {
	ServerPort        int      `mapstructure:"SERVER_PORT"` //.values supported: kafka
	EventType         string   `mapstructure:"EVENT_TYPE"`  //.values supported: kafka
	EventHosts        []string `mapstructure:"EVENT_HOSTS"`
	PostgresHost      string   `mapstructure:"POSTGRES_HOST"`
	PostgresUser      string   `mapstructure:"POSTGRES_USER"`
	PostgresPassword  string   `mapstructure:"POSTGRES_PASSWORD"`
	PostgresDB        string   `mapstructure:"POSTGRES_DB"`
	PostgresPort      string   `mapstructure:"POSTGRES_PORT"`
	PostgresSSLMode   string   `mapstructure:"POSTGRES_SSL_MODE"`
	DBString          string   `mapstructure:"DB_STRING"`
	TokenSymmetricKey string   `mapstructure:"TOKEN_SYMMETRIC_KEY"`
	DummyPasswordHash string   `mapstructure:"DUMMY_PASSWORD_HASH"`
	JwtSecret         string   `mapstructure:"JWT_SECRET"`
}

// Note, these are necessary for the struct marshalling to pick up env variables in the case that the config file does not exist
func setEnvDefaults() {
	viper.SetDefault("SERVER_PORT", "4000")
	viper.SetDefault("EVENT_TYPE", "kafka")
	viper.SetDefault("EVENT_HOSTS", "localhost:9093")

	viper.SetDefault("POSTGRES_HOST", "localhost")
	viper.SetDefault("POSTGRES_USER", "postgres")
	viper.SetDefault("POSTGRES_PASSWORD", "")
	viper.SetDefault("POSTGRES_DB", "ok-scoring-rules")
	viper.SetDefault("POSTGRES_PORT", "5432")
	viper.SetDefault("POSTGRES_SSL_MODE", "disable")
	viper.SetDefault("DB_STRING", "")
	viper.SetDefault("DUMMY_PASSWORD_HASH", "")
	viper.SetDefault("JWT_SECRET", "")
}

func LoadConfig(path string) (*Config, error) {
	viper.AddConfigPath(path)
	// This is how you would specify the name of the config file, ex app.env
	viper.SetConfigName(".env")
	viper.SetConfigType("env")

	// If the env variables exist in the env, they will overwrite the file values
	viper.AutomaticEnv()
	setEnvDefaults()

	err := viper.ReadInConfig()

	if err != nil {
		if _, ok := err.(viper.ConfigFileNotFoundError); ok {
			// Attempt to read from env variables
			log.Println(".env file not found, hopefully you set the env variables!")
		} else {
			return nil, err
		}
	}

	var config Config

	err = viper.Unmarshal(&config)
	if err != nil {
		return nil, err
	}
	return &config, nil
}
