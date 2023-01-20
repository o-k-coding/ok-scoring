package main

func (app *application) handleRulesTemplateChangeMessages() {
	app.logger.Printf("Started listening for rulesTemplateChangeEvents")
	// TODO this actually only confirms when the function exits, which will only happen on shutdown or error lol.
	// Also can bulkify the messages too
	defer func() {
		err := app.rulesTemplateChangeEvents.ConfirmMessageProcessed()
		if err != nil {
			app.logger.Print("error confirming message processing, possible duplicate message on next startup")
		}
	}()

	for {
		event, err := app.rulesTemplateChangeEvents.Consume()
		// TODO on error we just stop consuming? come on man
		if err != nil {
			break
		}
		app.logger.Printf("rulesTemplateChangeEvents message received %s", event.Message)
		app.logger.Printf("sending message to be indexed")

		// This is idempotent from the perspective of processing the same message multiple times because the ID is used, which will always be the ID of the DB record.
		// However IF messages are out of order, this could cause an issue because the most recently added message will be the data available for search
		// This could be fixed by using some incrementing value that is shared across all processes that could send these messages.
		// However, then we would need to check this incrementing value, and if it was less than the existing one, discard it.
		// BUT using a single topic ensures ordering. So, the only scenario where the changes are had out of order is if one instance of the service receives an UPDATE, and another receives a second UPDATE
		// for the same record, and the first one is slower than the second one, which is a larger problem altogether anyway.
		// DB locking the row, or sticky routing of requests to service instances is probably the answer?
		err = app.rulesSearch.Add(event.ID, event.Message)
		if err != nil {
			app.logger.Printf("error indexing message %s: %e", event.Message, err)
			continue
		}
		app.logger.Printf("rules template change indexed")
	}
}
