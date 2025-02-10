---
template: article
date: 2014-05-11
title: Bust the cache out of it
stage: published
tags:
  - nodejs
  - cache busting
---

This will be a short one, the topic of cache busting isn't new, it's covered by a wide range of articles. What I'll cover here is the basics and how I tackled a particular scenario.

---

## Why cache busting?

It's a strategy made popular due to how the majority of the www internet works, a story told with two major actors:

- Caching Proxies, many of which exist between your browser and the websites you visit.
- Your Browser: how it interprets the response headers.

Many of them are configured in different ways, but mostly they exist to alleviate the amount of data being moved around at the extremities.

The affects on websites isn't apparent until you try to update some external asset files (images, javascript, stylesheets, fonts, etc). When people visit your site in the initial version their browser and all the caching proxies saved copies of the assets. When you updated those assets, your browser and the caching proxies only determine if they need to get a new copy based on a few bits of meta data (most of which the average webserver doesn't deliver). The end result is that your website starts having problems due to incorrect stylesheets, scripts and fonts.

## An initial strategy

One of the first solutions to show up in response to this was to simply put a GET parameter after any asset you linked to :

```html
logo.png?cachebust={% now %}
```

Here in this example, I'm using preprocessed html templating language `jinja`. Simply inserting the current timestamp as a query param helps to fool some caching proxies and browsers to fetch the file again. They do this because they think the resource is dynamic.

The problem with this is that some proxies and browsers ignore this and serve the same file again.

## A strategy, robust

People with more perseverance sought a more robust strategy, one that would guarantee the correct file is delivered.

It starts with the idea that your assets only change if you push new assets into the deployment workflow, so if they're not changing between deployments and the proxy servers are ignoring GET parameters, then why don't we change the file name each deployment only if the file changes?

This is the goal of `grunt-usemin` and `grunt-rev`, two tools used with the Grunt task runner.

### Peculiar problem of relative paths

The situation is that some of my pages in this website have images generated from something that looks at a directory and says "alright, lets make a collection of images", other pages I point at the image myself in the markdown. Sometimes it's relative path, sometimes absolute.

By default `grunt-usemin` only operates on absolute paths, assuming you'll be keeping all your assets in a common location.

To get all your files revved I ended up with the following :

```coffeescript

    useminPrepare:
      dist:
        src: ['<%= paths.dist %>/**/*.html']

    rev:
      dist:
        files:
          src: [
            '<%= paths.dist %>/assets/js/{,*/}*.js'
            '<%= paths.dist %>/assets/css/{,*/}*.css'
            '<%= paths.dist %>/assets/font/{,*/}*.{ttf,eot,otf,woff,svg}'
            '<%= paths.dist %>/{,**/}**.{png,jpg,jpeg,gif,webp,svg}'
          ]

    usemin:
      options:
        assetsDirs: [
          '<%= paths.dist %>/**/*'
          '<%= paths.dist %>/'
        ]
        patterns:
          html: [
            [/(js\/[\w\d-]*\.js)/g, "Replacing javascript link"]
            [/(css\/[\w\d-]*\.css)/g, "Replacing stylesheet link"]
            [/(img\/[\w\d-]*\.(png|jpeg|jpg|gif))/g, "Replacing image link"]
          ]

      html: ['<%= paths.dist %>/**/*.html']
      css: ['<%= paths.dist %>/assets/css/**/*.css']

```

I believe the important parts are :

- _`useminPrepare.dist.src`_
  : Nothing occurs without this... pretty standard stuff, it just points `useminPrepare` at the collection of files to operate on.

- _`rev.dist.files.src -> last item`_
  : Need to be able to act on any image, regardless of where it is.

- _`usemin.options.patterns.html`_
  : This overrides the default matching and applies simple pattern matching of my own that allows for matching relative paths, as long as they start with `img/`.

## Conclusion

_Is it perfect?_
: probably not.

_Does it work?_
: yes.

_What do I think can be improved?_
:remove the need to be in an `img` folder.

Without cache busting, your life as a web developer is considerably more stressful. Phone calls, tickets, whispers you shouldn't have to deal with, they all start hanging on your shoulders.
