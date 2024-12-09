---
template: article
title: BEM and the case for simplicity
date: 2018-10-03
stage: published
tags:
  - css
  - architecture
---

## Where we came from

You have a deadline, you need to deliver something approximating the design before you fully implement even a part of the design.

So you'd use a framework that creates css... usually something like Foundation or Bootstrap.

```html
<div class="hero row">
  <div class="columns small-12 medium-4 hero-image">
    <img src="/static/images/hero-image.png" />
  </div>
  <div class="columns small-12 medium-8 hero-content">
    <h3>People don't buy what you do; they buy why you do it.</h3>
    <p>
      We are drawn to leaders and organizations that are good at communicating
      what they believe. Their ability to make us feel like we belong, to make
      us feel special, safe and not alone is part of what gives them the ability
      to inspire us.
    </p>
  </div>
</div>
```

Great. It gets delivered and people get off your back.

Now you begin implementing the design. You rationalise that your framework has structured your page layout so all you need to do is fill in with colours and font sizes.

So you end up with something like:

```css
.hero {
  background-color: $lightblue;
}

.hero-image {
  margin: 0 auto;
}

.hero-content {
  padding: 1rem;
}

.body.home-page .hero {
  background-color: $lightyellow;
}

.body.home-page .hero .hero-image {
  margin-top: 10rem;
}
```

It works. you ship it. deadline is near or just passed by.

You rationlise the following choices:

1. atomised classes so client requests to change

## BEM

You've probably seen it around. `.block__element--modifier`.

It `.Has_Various-Styles`.

It also proposes a re-usable component way of controlling the css cascade.

### Your component

A simple example of what we typically implement in our forms.

```jsx
export default function TextFormField ({
    id = cuid(),
    label,
    name,

    type = 'text',
    value
  }) {

  const classnames = (...parts) => parts.filter(part => !!part).join(' ')

return (
    <div className={classnames(
        'form-field',
        'form-field--text',
        type && `form-field--${type}`
      )}>

      <input className="form-field__input"
             type={type}
             id={id}
             name={name}
             required
             value={value}>

      <label className="form-field__label"
             htmlFor={id}>
        {label}
      </label>

    </div>
  );
}
```

And reusing this amounts to:

```jsx
import FormField from 'component-library/form-field';
import FormAction from 'component-library/form-action';

export default class App extends React.Component {
  render() {
    return (
      <form
        className="login-form"
        onSubmit={this.handleSubmit}
      >
        <FormField
          id={`login-form-${cuid()}`}
          name="email"
          value={this.state.email}
          type="email"
        />

        <FormField
          id={`login-form-${cuid()}`}
          name="password"
          value={this.state.password}
          type="password"
        />

        <div className="form-field-group form-field-group--horizontal login-form__form-field-group">
          <FormAction type="submit">login</FormAction>
        </div>
      </form>
    );
  }
}
```

Then to style it you need to write:

```css
.login-form .form-field {
  margin-bottom: 1rem;
}

.login-form .form-field__input {
  border-color: grey;
}

.login-form .form-field__label {
  color: grey;
}
```

Instead lets use BEM mixes:

```jsx
export default function TextFormField ({
    id = cuid(),
    label,
    name,
    classNames,
    mixClassName,
    type = 'text',
    value
  }) {

  const classnames = (...parts) => parts.filter(part => !!part).join(' ')

  return (
    <div className={classnames(
        TextFormField.CONST__BASE_CLASSNAME,
        `${TextFormField.CONST__BASE_CLASSNAME}--text`,
        type && `${TextFormField.CONST__BASE_CLASSNAME}--${type}`,

        mixClassName,
        mixClassName && `${mixClassName}--text`,
        mixClassName && type && `${mixClassName}--${type}`,

        classNames && classNames
      )}>

      <input className={classnames(
              `${TextFormField.CONST__BASE_CLASSNAME}__input`,
              mixClassName && `${mixClassName}__input`,
             )}
             type={type}
             id={id}
             name={name}
             required
             value={value}>

      <label className={classnames(
              `${TextFormField.CONST__BASE_CLASSNAME}__label`,
              mixClassName && `${mixClassName}__label`,
             )}
             htmlFor={id}>
        {label}
      </label>

    </div>
  );
}

TextFormField.CONST__BASE_CLASSNAME = 'form-field';
```

Now our app will look like :

```jsx
import FormField from 'component-library/form-field';
import FormAction from 'component-library/form-action';

export default class App extends React.Component {
  render() {
    return (
      <form
        className="login-form"
        onSubmit={this.handleSubmit}
      >
        <FormField
          mixClassName="login-form__form-field"
          classNames="login-form__email-form-field"
          id={`login-form-${cuid()}`}
          name="email"
          value={this.state.email}
          type="email"
        />

        <FormField
          mixClassName="login-form__form-field"
          classNames="login-form__password-form-field"
          id={`login-form-${cuid()}`}
          name="password"
          value={this.state.password}
          type="password"
        />

        <div class="form-field-group form-field-group--horizontal login-form__form-field-group">
          <FormAction
            mixClassName="login-form__form-action"
            classNames="login-form__submit-form-action"
            type="submit"
          >
            login
          </FormAction>
        </div>
      </form>
    );
  }
}
```

Now our css can minimise the specificity score of our css.

```css
.login-form {
  border: 1px dashed silver;
}

.login-form__form-field {
  margin-bottom: 1rem;
}

.login-form__form-field__input {
  border: 1px dashed silver;
}

.login-form__form-field__label {
  color: darkgrey;
}

.login-form__email-form-field {
  /* some inspiring css */
}

.login-form__password-form-field {
  /* some inspiring css */
}

.login-form__submit-form-action {
  /* some inspiring css */
}
```

## Caveats

- It's an approach to minimising impact on the maintenance story, where time is more critical than initial development phase.
- Changes to particular implementations to `login-form` can be quarantined from each other.

## Further Reading

- https://martinwolf.org/before-2018/blog/2014/05/making-use-of-the-bem-naming-system/
- https://davidwalsh.name/designing-simplicity
