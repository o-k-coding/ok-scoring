package main

import "strings"

func (app *application) handleFavoriteRuleTemplateMessages() {
	app.logger.Printf("Started listening for  favoriteRuleTemplateEvents")
	defer func() {
		err := app.favoriteRulesTemplateEvents.ConfirmMessageProcessed()
		if err != nil {
			app.logger.Print("error confirming message processing, possible duplicate message on next startup")
		}
	}()

	for {
		event, err := app.favoriteRulesTemplateEvents.Consume()
		if err != nil {
			break
		}
		app.logger.Printf("message received %s", event.Message)
		keys := strings.Split(event.Message, ",")
		err = app.models.DB.FavoriteGame(keys[1], keys[0])
		if err != nil {
			app.logger.Printf("error saving favorite game %s for player %s: %e", keys[1], keys[0], err)
			continue
		}
		app.logger.Printf("favorite game saved %s for player %s", keys[1], keys[0])
		// TODO could configure this to batch messages
		err = app.favoriteRulesTemplateEvents.ConfirmMessageProcessed()
		if err != nil {
			app.logger.Printf("error confirming message processing, possible duplicate message on next startup %e", err)
		}
	}
}
