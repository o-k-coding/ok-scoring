package main

func (app *application) handleRulesTemplateChangeMessages() {
	app.logger.Printf("Started listening for rulesTemplateChangeEvents")
	defer func() {
		err := app.rulesTemplateChangeEvents.ConfirmMessageProcessed()
		if err != nil {
			app.logger.Print("error confirming message processing, possible duplicate message on next startup")
		}
	}()

	for {
		m, err := app.rulesTemplateChangeEvents.Consume()
		if err != nil {
			break
		}
		app.logger.Printf("rulesTemplateChangeEvents message received %s", m)
		// TODO does this handle if it was already indexed previously?
		app.logger.Printf("sending message to be indexed")
		err = app.rulesSearch.Add(m)
		if err != nil {
			app.logger.Printf("error indexing message %s: %e", m, err)
			continue
		}
		app.logger.Printf("rules template change indexed")
	}
}
