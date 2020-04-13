import { openDatabase } from "expo-sqlite";

export default class Connection {

    constructor() {
        this.db = openDatabase("test.db")
        this.create()

        this.CREATE_SQL = "create table if not exists scores (id integer primary key not null, score int unique, score_date DateTime);";
        this.INSERT_SQL = "insert into scores (score, score_date) values (?, ?);";
        this.GET_SQL    = "select distinct score, score_date from scores order by score desc limit 3 ";
        this.DELETE_ALL = "delete from scores where id > 0;"
        this.DELETE_SCORE = "delete from scores where score=?"
    }

   
    create() {
        this.db.transaction(tx => {
            tx.executeSql(this.CREATE_SQL)
        })
    }

    get(cb) {
        
        this.db.transaction(tx => {
            tx.executeSql(this.GET_SQL, [], (_ , {rows}) => {
                return cb(rows["_array"])
            })
        })
    }

    delete(score) {
        this.db.transaction(tx => {
            tx.executeSql(this.DELETE_SCORE, [socre])
        })
    }

    deleteAll() {
        this.db.transaction(tx => {
            tx.executeSql(this.DELETE_ALL)
        })
    }

    insert(score) {
        this.db.transaction(tx => {
            tx.executeSql(this.INSERT_SQL, [score, new Date().toDateString()])
        })
    }

}