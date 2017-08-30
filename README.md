A simple SQL query builder. It executes built queries if an executing function is set.

 1. <a name="cusage"></a>[Usage](#usage)
 2. <a name="cversionHistory"></a>[Version history](#versionHistory)

### <a name="usage"></a>[Usage](#cusage)

 1. <a name="csqlBuilder"></a>[SqlBuilder](#sqlBuilder)
 2. <a name="ctableBuilder"></a>[TableBuilder](#tableBuilder)
 3. <a name="ccolumn"></a>[Column](#column)
 4. <a name="cuniqueBuilder"></a>[UniqueBuilder](#uniqueBuilder)
 5. <a name="cinsertUpdateBuilder"></a>[InsertUpdateBuilder](#insertUpdateBuilder)
 6. <a name="cwhereBuilder"></a>[WhereBuilder](#whereBuilder)
 7. <a name="ccondition"></a>[Condition](#condition)
 8. <a name="cselectBuilder"></a>[SelectBuilder](#selectBuilder)
 9. <a name="cfromBuilder"></a>[FromBuilder](#fromBuilder)

#### <a name="sqlBuilder"></a>[SqlBuilder<i class="icon-up"></i>](#csqlBuilder)

This is the "entry point" of the builder. It contains only `static` methods and fields.

    import SqlBuilder from "simple-sql-query-builder";

 1. <a name="csqlBuilderSetDebug"></a> [setDebug()](#sqlBuilderSetDebug)
 2. <a name="csqlBuilderSetSqlExecutor"></a>[setSqlExecutor()](#sqlBuilderSetSqlExecutor)
 3. <a name="csqlBuilderExecuteSql"></a>[executeSql()](#sqlBuilderExecuteSql)
 4. <a name="csqlBuilderCreateTable"></a>[createTable()](#sqlBuilderCreateTable)
 5. <a name="csqlBuilderInsert"></a>[insert()](#sqlBuilderInsert)
 6. <a name="csqlBuilderSelect"></a>[select()](#sqlBuilderSelect)
 7. <a name="csqlBuilderUpdate"></a>[update()](#sqlBuilderUpdate)
 8. <a name="csqlBuilderDelete"></a>[delete()](#sqlBuilderDelete)
 9. <a name="csqlBuilderStaticFields"></a>[static fields](#sqlBuilderStaticFields)

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
	
	Executes an sql statement by invoking a function set by `setSqlExecutor()`. It returns the result of that function invocation or simply the passed sql statement if `setSqlExecutor()` hasn't been called.
	
	The result of invoking this method is returned from the CRUD methods.
	
		SqlBuilder.executeSql("some sql code);

 - <a name="sqlBuilderCreateTable"></a>[createTable()<i class="icon-up"></i>](#csqlBuilderCreateTable)
	
	Creates a table using [TableBuilder](#tableBuilder).
	
        const name = "weights";
        
        const callback = tb => {
            tb.integer("rowid").primary();
            tb.integer("millis").notNull();
            tb.integer("gross").notNull();
            tb.integer("net").notNull();
            tb.text("comment").notNull();
        };
        
        const ifNotExists = Boolean; // Adds "IF NOT EXISTS" if true. Default: true.
        
        SqlBuilder.createTable(name, callback, ifNotExists);

 - <a name="sqlBuilderInsert"></a>[insert()<i class="icon-up"></i>](#csqlBuilderInsert)
    
    Inserts a row using [InsertUpdateBuilder](#insertUpdateBuilder).
    
        const table = "weights";
        
        const callback = ib => ib
            .columnValue("millis", new Date().getTime())
            .columnValue("gross", gross)
            .columnValue("net", net)
            .columnValue("comment", comment);
        
        SqlBuilder.insert(table, callback);

 - <a name="sqlBuilderSelect"></a>[select()<i class="icon-up"></i>](#csqlBuilderSelect)
    
    Selects rows using [SelectBuilder](#selectBuilder).
    
        SqlBuilder.select(sb => sb
            .column("rowid")
            .column("*")
            .from("weights"));

 - <a name="sqlBuilderUpdate"></a>[update()<i class="icon-up"></i>](#csqlBuilderUpdate)
    
    Updates rows using [InsertUpdateBuilder](#insertUpdateBuilder).
    
        const table = "expenseImages";
        
        const callback = ub => ub
            .columnValue("path", path)
            .where(wb => wb.column("rowid").e(image.rowid));
        
        SqlBuilder.update(table, callback);

 - <a name="sqlBuilderDelete"></a>[delete()<i class="icon-up"></i>](#csqlBuilderDelete)
    
    Deletes rows using [WhereBuilder](#whereBuilder).
    
        const table = "journeys";
        const callback = wb => wb.column("rowid").e(rowid);
        
        SqlBuilder.delete(table, callback);

 - <a name="sqlBuilderStaticFields"></a>[static fields<i class="icon-up"></i>](#csqlBuilderStaticFields)
    
    There are several `static` fields in the class to facilitate creating instances of commonly used auxiliary classes: `SelectBuilder`, `WhereBuilder` and `Condition`. So instead of
    
        import SelectBuilder from "simple-sql-query-builder/js/SelectBuilder";
        
        const sb = new SelectBuilder();

    you can just write
    
        const sb = new SqlBuilder.SelectBuilder();

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

All these methods return `this` to allow method chaining.

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

#### <a name="insertUpdateBuilder"></a>[InsertUpdateBuilder<i class="icon-up"></i>](#cinsertUpdateBuilder)

All these methods return `this` to allow method chaining.

 - columnValue()

    Specifies a column value.
    
        insertUpdateBuilder.columnValue(
            column,
            value,
            add, // Boolean. If true this column will be added to the generated SQL code. Default: true.
            quoteIfString // Boolean. If true and value is a string, quotes are added to the generated SQL code for this value. Default: true.
        );

    Examples:
    
     - `"INSERT INTO tableName (columnName1) VALUES (10);"`
    
            SqlBuilder.insert(
                "tableName",
                ib => ib.columnValue("columnName1", 10));
        
        or
        
            SqlBuilder.insert(
                "tableName",
                ib => ib
                    .columnValue("columnName1", 10)
                    .columnValue("columnValue2", 20, false));

     - `"INSERT INTO tableName (columnName1, columnName2) VALUES (10, "String value");"`
        
            SqlBuilder.insert(
                "tableName",
                ib => ib
                    .columnValue("columnName1", 10)
                    .columnValue("columnName2", "String value"));

 - where()

    Specifies a `WHERE` clause. It's a no-op if this instance is used for insertion.
    
        insertUpdateBuilder.where(
            callbackOrConditionString, // See below.
            add // Boolean. If true the WHERE-clause will be added to the generated SQL code. Default: true.
        );

    `callbackOrConditionString` can be one of:
    
     - A callback receiving a [WhereBuilder](#whereBuilder) instance;
     - a string without `WHERE` itself;
     - A [Condition](#condition) instance;
    
    Examples:

     - `UPDATE tableName SET columnName1 = 10, columnName2 = "String value" WHERE columnName3 = 314;`
        
            SqlBuilder.update(
                "tableName",
                ib => ib
                    .columnValue("columnName1", 10)
                    .columnValue("columnName2", "String value")
                    .where(wb => wb.column("columnName3").e(314)));

        or

            SqlBuilder.update(
                "tableName", ib => ib
                    .columnValue("columnName1", 10)
                    .columnValue("columnName2", "String value")
                    .where("columnName3 = 314"));

        or
        
            const condition = new SqlBuilder.Condition("columnName3");
            condition.e(314);
            
            SqlBuilder.update(
                "tableName",
                ib => ib
                    .columnValue("columnName1", 10)
                    .columnValue("columnName2", "String value")
                    .where(condition));

#### <a name="whereBuilder"></a>[WhereBuilder<i class="icon-up"></i>](#cwhereBuilder)

#### <a name="condition"></a>[Condition<i class="icon-up"></i>](#ccondition)

#### <a name="selectBuilder"></a>[SelectBuilder<i class="icon-up"></i>](#cselectBuilder)

#### <a name="fromBuilder"></a>[FromBuilder<i class="icon-up"></i>](#cfromBuilder)

### <a name="versionHistory"></a>[Version history](#cversionHistory)

Version number|Changes
-|-
v1.0.1|1.&nbsp;Readme updated.<br>2.&nbsp;`UPDATE` queries weren't terminated with `;`. Fixed.
v1.0.0|Initial release.

<br><br>
> Written with [StackEdit](https://stackedit.io/).
