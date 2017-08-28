An SQL query builder for RN projects. It executes built queries if an executing function is set.

### Usage

 1. <a name="csqlBuilder"></a>[SqlBuilder](#sqlBuilder)
 1. <a name="ctableBuilder"></a>[TableBuilder](#tableBuilder)
 1. <a name="ccolumn"></a>[Column](#column)
 1. <a name="cuniqueBuilder"></a>[UniqueBuilder](#uniqueBuilder)

#### <a name="sqlBuilder"></a>[SqlBuilder<i class="icon-up"></i>](#csqlBuilder)

This is the "entry point" of the builder. It contains only `static` methods and fields.

    import SqlBuilder from "react-native-common-utils";

 1. <a name="csqlBuilderSetDebug"></a> [setDebug()](#sqlBuilderSetDebug)
 1. <a name="csqlBuilderSetSqlExecutor"></a>[setSqlExecutor()](#sqlBuilderSetSqlExecutor)
 1. <a name="csqlBuilderExecuteSql"></a>[executeSql()](#sqlBuilderExecuteSql)
 1. <a name="csqlBuilderCreateTable"></a>[createTable()](#sqlBuilderCreateTable)

<!-- -->

 - <a name="sqlBuilderSetDebug"></a>[setDebug()<i class="icon-up"></i>](#csqlBuilderSetDebug)
	
	Turns on or off the debug mode. In debug mode each executed sql statement is logged to the console.
	
        SqlBuilder.setDebug(debug);

 - <a name="sqlBuilderSetSqlExecutor"></a>[setSqlExecutor()<i class="icon-up"></i>](#csqlBuilderSetSqlExecutor)

	Sets a function to be used to execute sql statements.
	
        import SQLite from "react-native-sqlite-storage";
        
        ...
        
        const db = await SQLite.openDatabase(...);
        
        SqlBuilder.setSqlExecutor(db.executeSql.bind(db));

 - <a name="sqlBuilderExecuteSql"></a>[executeSql()<i class="icon-up"></i>](#csqlBuilderExecuteSql)
	
	Executes an sql statement by invoking a function set by `setSqlExecutor()`. It returns the result of that function invocation or simply the passed sql statement if `setSqlExecutor` hasn't been called.
	
	The result of invoking this method is returned from the CRUD methods.
	
		SqlBuilder.executeSql("some sql code);

 - <a name="sqlBuilderCreateTable"></a>[createTable()<i class="icon-up"></i>](#csqlBuilderCreateTable)
	
	Creates a table using [TableBuilder](#tableBuilder).
	
        const name = "weights";
        
        const callback = tableBuilder => {
            tb.integer("rowid").primary();
            tb.integer("millis").notNull();
            tb.integer("gross").notNull();
            tb.integer("net").notNull();
            tb.text("comment").notNull();
        };
        
        const ifNotExists = Boolean; // Adds "IF NOT EXISTS" if true. Default: true.
        
        SqlBuilder.createTable(name, callback, ifNotExists);

#### <a name="tableBuilder"></a>[TableBuilder<i class="icon-up"></i>](#ctableBuilder)

 - column()
	
	Creates a [Column](#column) and returns it to allow method chaining.
	
        tb
            .column(
                name: "rate",
                type: "REAL")
            .notNull();
	
	There are shorthands for the `INTEGER`, `TEXT` and `BLOB` types:
	
        tb.integer("rowid").primary();
        tb.text("comment").notNull();
        tb.blob("image");

 - unique()
	
	Makes a column unique using [UniqueBuilder](#uniqueBuilder).
	    
        tb.unique(ub => {
            ub
                .column("name")
                .collate("NOCASE")
                .order("ASC");
            
            ub
                .column("code")
                .collate("NOCASE")
                .order("ASC");
        });

#### <a name="column"></a>[Column](#ccolumn)

 - primary()
	
	Adds `PRIMARY KEY` to this column definition.

 - foreign()

	Adds `REFERENCES tableName(columnName)` to this column definition.
	
		tb.integer("type").foreign("tableName", "columnName");

 - onDelete()
	
	Adds `ON DELETE action` to this column definition.
	
        tb.integer("journeyRowid")
            .foreign("tableName", "column name")
            .onDelete("action");

 - notNull()
	
	Adds `NOT NULL` to this column definition.

#### <a name="uniqueBuilder"></a>[UniqueBuilder<i class="icon-up"></i>](#cuniqueBuilder)

 - column()

	Specifies the unique column name and optionally collation and order.
	
        ub
            .column("code")
            .collate("NOCASE")
            .order("ASC");

### Version history

Version number|Changes
-|-
v1.0.0|Initial release.
<br><br>
> Written with [StackEdit](https://stackedit.io/).
