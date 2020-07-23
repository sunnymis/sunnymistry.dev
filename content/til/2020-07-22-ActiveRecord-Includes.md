---
title: Performant Queries with ActiveRecord Includes
date: "2020-07-22"
template: "til"
draft: false
slug: "performant-queries-activerecord-includes"
tags:
  - "rails"
---

Let's say we have a `User` model and each user has many `Posts`. To get a list of all of the posts
for a user we may do something like:

```ruby
posts = User.all.map { |u| u.posts }
```

This is perfectly reasonable and will work for a majority of cases. However, if you have a large 
number of users and posts this can be a very slow lookup. This line of code will run `N + 1` queries. 
The first SQL query will be to retrieve a list of all users and then execute `N` SQL queries to retrieve
the posts for each user. 

The `includes` method allows you to specify relationships to be included in the resulting set of data. This
is often called `eager loading` and improves performance because it allows you to retrieve all the data you
need in a single query, without firing additional queries. 

```ruby
users_with_posts = User.includes(:posts)
```
