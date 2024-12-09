---
template: article
title: Jquery Plugin Components
date: 2012-09-13
stage: published
tags:
  - component-driven-development
---

Component Driven Development is where your UI is built up from a series of components. Each component is a self-contained piece of code that handles its own rendering, state and behaviour.

One popular library that has been overlooked as a component library is Jquery. Not everyone sees it as such, but I'm about to show you how.

## What you need from a component

A component should be:

- **Composable**: You should be able to use it in combination with other components.
- **Stateful**: It should be able to manage its own state.
- **Configurable**: It should be able to be configured to behave in different ways.

So such a plugin needs to be able to work amongst the markup of other plugins. We should be able to configure each instance separately. And we should be able to manage the state of each instance separately.

To that end, lets start with the basics:

```js
$.fn.myPlugin = function (options) {
  return this.each(function () {
    var $this = $(this);
    var data = $this.data('myPlugin');
    var settings = $.extend(
      {
        foo: 'bar',
      },
      options,
      data
    );

    if (!data) {
      $this.data('myPlugin', {
        target: $this,
        settings: settings,
      });
    }
  });
};

(function () {
  $('[data-my-plugin]').myPlugin();
})();
```

with this rudimentary plugin, we can now do the following:

```html
<div data-my-plugin="{'foo':'boom'}"></div>
```

But we can make the html DX better by allowing the plugin to be configured via separate data attributes:

```js
var MyPluginDefaults = {
  foo: 'bar',
};
function toCamelCase(str) {
  return str.replace(/-([a-z])/g, function (g) {
    return g[1].toUpperCase();
  });
}
function toDashCase(str) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

function getSettingsFromElementAttributes($el, prefix) {
  var attributes = $el.getAttributes();
  var settings = {};
  for (var key in attributes) {
    // if the key is the same as the prefix, then it's a single setting
    // so lets extend the settings with the value
    if (toCamelCase(key) === prefix) {
      settings = Object.assign(settings, attributes[key]);
    }
    // if the key starts with the prefix, then it's a setting
    // so lets add the value to the settings object
    if (key.indexOf(prefix) === 0) {
      var settingKey = key.replace(prefix, '').toLowerCase();
      settings[settingKey] = attributes[key];
    }
  }
  if (Object.keys(settings).length === 0) {
    return null;
  }

  return settings;
}

function setSettingsToElementAttributes($el, prefix, settings) {
  for (var key in settings) {
    $el.setAttribute(prefix + toDashCase(key), settings[key]);
  }
}

$.fn.myPlugin = function (options) {
  return this.each(function () {
    var $this = $(this);
    var elemenSettings = getSettingsFromElementAttributes($this, 'my-plugin');
    var settings = $.extend(MyPluginDefaults, options, elemenSettings);

    if (elemenSettings === null) {
      setSettingsToElementAttributes($this, 'my-plugin', settings);
    }
  });
};

(function () {
  $('[data-my-plugin]').myPlugin();
})();
```

now with this, we can do the following:

```html
<div data-my-plugin-foo="boom"></div>
```

or

```html
<div data-my-plugin="{'foo':'boom'}"></div>
```
