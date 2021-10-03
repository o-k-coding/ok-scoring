import { createContext } from 'react';
import { observable, action } from 'mobx';
import { initSQLLiteDb } from '@ok-scoring/data/sqlite-fns';

class LocalDbStore {
    @observable dbInitialized = false;
    @observable dbError = false;

    @action setDbInitialized = (initialized: boolean) => {
        this.dbInitialized = initialized;
    }

    initLocalDb = async () => {
        try {
            await initSQLLiteDb();
            this.setDbInitialized(true);
        } catch (e) {
            this.dbInitialized = true;
            this.setDbInitialized(true);
            console.error(e);
        }
    }
}

export const localDbStore = new LocalDbStore();
export const localDbContext = createContext(localDbStore);
