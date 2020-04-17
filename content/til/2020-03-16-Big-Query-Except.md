---
title: Big Query EXCEPT
date: "2020-03-16"
template: "til"
draft: false
slug: "big-query-except"
tags:
  - "sql"
  - "bigquery"
---

When querying relational tables in Big Query you might want to grab all the columns except a couple. 
I've run into this a few times where I want all the data from two joined tables, but I don't want the `created_at`, `updated_at`
columns that they both contain. Big Query will throw an error saying you can't have duplicate columns. This can be fixed using
`EXCEPT`

```sql
SELECT A.*, B.* EXCEPT (created_at, updated_at)
FROM A
LEFT JOIN B
ON a.id = b.a_id
```

[Big Query SQL Query Syntax Reference](https://cloud.google.com/bigquery/docs/reference/standard-sql/query-syntax)

