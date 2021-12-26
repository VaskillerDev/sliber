import IKeyValueStorage from "../../IKeyValueStorage";
import Database from "better-sqlite3"

const DB_FILE = './sliber.sqlite';
const KV_TABLE = 'kv';

export default class SqliteKeyValueStorage 
    implements IKeyValueStorage {
    
    readonly #database : SqliteDatabase;
    readonly #pullStatement : SqliteStatement;
    readonly #pullTransaction : SqliteTransaction;
    
    readonly #pushStatement : SqliteStatement;
    readonly #pushTransaction : SqliteTransaction;
    
    constructor() {
        this.#database 
            = new Database(DB_FILE, { verbose: console.log });
        this.#pullStatement 
            = this.#database.prepare(`SELECT value FROM kv WHERE key = ?`);
        this.#pushStatement 
            = this.#database.prepare(`INSERT INTO kv (key,value) VALUES (?,?)`);
        
        this.#pullTransaction = this.#database.transaction(key => {
           return this.#pullStatement.get(key);
        });
        this.#pushTransaction = this.#database.transaction((key, value) => {
            this.#pushStatement.run(key, value);
        });
    }
    
    public async pull(key: string): Promise<any> {
        return this.#pullTransaction(key);
    }

    public async push(key: string, value: string | object): Promise<void> {
        return this.#pushTransaction(key,value);
    }
    
}

type SqliteDatabase = Database.Database;
type SqliteStatement = Database.Statement;
type SqliteTransaction = Database.Transaction;