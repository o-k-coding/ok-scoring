package main

import (
	"errors"
	"fmt"
	"io"
	"net/http"
	"strings"

	"github.com/graphql-go/graphql"
	"okscoring.com/rules-service/src/models"
)

var rulesTemplates []*models.GameRulesTemplate

var rulesTemplateType = graphql.NewObject((
	graphql.ObjectConfig{
		Name: "rulesTemplate",
		Fields: graphql.Fields {

			"key": &graphql.Field{
				Type: graphql.String,
			},

			"playerKey": &graphql.Field{
				Type: graphql.String,
			},

			"description": &graphql.Field{
				Type: graphql.String,
			},

			"validStateSchema": &graphql.Field{
				Type: &graphql.Object{},
			},

			"winningSchema": &graphql.Field{
				Type: &graphql.Object{},
			},

			"firstToScoreWins": &graphql.Field{
				Type: graphql.Boolean,
			},

			"dealerSettings": &graphql.Field{
				Type: graphql.String,
			},

			"highScoreWins": &graphql.Field{
				Type: graphql.Boolean,
			},

			"playersMustBeOnSameRound": &graphql.Field{
				Type: graphql.Boolean,
			},

			"createdAt": &graphql.Field{
				Type: graphql.DateTime,
			},

			"archived": &graphql.Field{
				Type: graphql.String,
			},
		},
	}),
)

// gql schema definition
var gqlFields = graphql.Fields{
	"rulesTemplateByKey": &graphql.Field{
		Type: rulesTemplateType,
		Description: "Get rules template by key",
		Args: graphql.FieldConfigArgument{
			"key": &graphql.ArgumentConfig{
				Type: graphql.String,
			},
		},
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			key, ok := p.Args["key"].(string) // casting to string
			if ok { // if it exists in the map
				for _, rulesTemplate := range rulesTemplates {
					if rulesTemplate.Key == key {
						return rulesTemplate, nil
					}
				}
			}
			return nil, nil
		},
	},

	"rulesTemplates": &graphql.Field{
		Type: graphql.NewList(rulesTemplateType),
		Description: "Get all rules templates",
		Resolve: func(params graphql.ResolveParams) (interface{}, error) {
			return rulesTemplates, nil
		},
	},

	"search": &graphql.Field{
		Type: graphql.NewList(rulesTemplateType),
		Description: "Search rules templates by description",
		Args: graphql.FieldConfigArgument{
			"descriptionContains": &graphql.ArgumentConfig{
				Type: graphql.String,
			},
		},
		Resolve: func(params graphql.ResolveParams) (interface{}, error) {
			var results []*models.GameRulesTemplate
			search, ok := params.Args["descriptionContains"].(string)

			if ok {
				for _, rulesTemplate := range rulesTemplates {
					if strings.Contains(rulesTemplate.Description, search) {
						results = append(results, rulesTemplate)
					}
				}
			}
			return results, nil
		},
	},
}

func (app *application) graphql(w http.ResponseWriter, r *http.Request) {
	rulesTemplates, _ = app.models.DB.GetAllRulesTemplates();

	requestBody, _ := io.ReadAll(r.Body)
	query := string(requestBody)

	app.logger.Println(query)

	rootQuery := graphql.ObjectConfig{
		Name: "RootQuery", Fields: gqlFields,
	}

	schemaConfig := graphql.SchemaConfig{Query: graphql.NewObject(rootQuery)}
	schema, err := graphql.NewSchema(schemaConfig)

	if err != nil {
		app.writeAndSendError(w, http.StatusInternalServerError, errors.New("failed to create gql schema"))
		return;
	}

	params := graphql.Params{ Schema: schema, RequestString: query }
	response := graphql.Do(params)

	if len(response.Errors) > 0 {
		app.writeAndSendError(w, http.StatusBadRequest, fmt.Errorf("failed: %+v", response.Errors))
	}

	app.writeAndSendJson(w, http.StatusOK, response, "data")
}
