---
title: Dynamic Finders in Rails
date: "2020-06-28"
template: "til"
draft: false
slug: "dynamic-finders-in-rails"
tags:
  - "rails"
  - "ruby"
---

Ruby on Rails makes it easy to find a specific record in a table based off some fields. With Active Record you can
search a model easily by the following:

`User.find_by(first_name: 'Sunny', last_name: 'Mistry')`

A cool feature that Rails provides is dynamically generating finder methods for every field on a table.

`User.find_by_first_name('Sunny')`

An even crazier thing is you can do this for multiple fields!

`User.find_by_first_name_and_last_name('Sunny', 'Mistry')`

This can go on for as many attributes as you like. I'm not really sure why anyone would do this but it is interesting.

[Dynamic Finders Rails Guides](https://guides.rubyonrails.org/active_record_querying.html#dynamic-finders)

[Source Code and Implementation](https://github.com/rails/rails/blob/v3.2.15.rc2/activerecord/lib/active_record/dynamic_matchers.rb)
