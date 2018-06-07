import { Logger } from "../utilities/logger";
import { Validation } from "../utilities/validation";
import { IMap } from "../core/core.models";

export class GameCache {

    private repo: {
        [collection: string]: {
            [name: string]: any;
        }
    } = {};
    private noCollectionKey = "_no-collection";

    
    constructor(private logger: Logger) {

    }

    public addItem(name: string, item: any, collection?: string): void {
        try {
            Validation.isNotEmptyString(name, "No name specified");
            if (collection) {
                Validation.isNotEmptyString(collection, "No collection specified");
            } else {
                collection = this.noCollectionKey;
            }
            if (!this.repo[collection]) {
                this.repo[collection] = {};
            }
            this.repo[collection][name] = item;
        } catch (e) {
            this.logger.error(e);
        }
    }

    public getItem<T>(name: string): T {
        try {
            Validation.isNotEmptyString(name, "No name specified");
            return this.repo[this.noCollectionKey][name];
        } catch (e) {
            this.logger.error(e);
        }
    }

    public getCollection<T>(collection: string): IMap<T> {
        try {
            Validation.isNotEmptyString(collection, "No collection specified");
            return this.repo[collection];
        } catch (e) {
            this.logger.error(e);
        }
    }

    public removeItem(name: string): void {
        try {
            Validation.isNotEmptyString(name, "No name specified");
            let collection = this.getCollection(this.noCollectionKey);
            delete collection[name];
            if (Object.keys(collection).length === 0) {
                this.removeCollection(this.noCollectionKey);
            }
        } catch (e) {
            this.logger.error(e);
        }
    }

    public removeCollection(collection: string): void {
        this.repo[collection] = undefined;
    }

}