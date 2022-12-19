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
		err = app.rulesSearch.Add(m)
		if err != nil {
			app.logger.Printf("error indexing message %s", m)
		}
	}
}
