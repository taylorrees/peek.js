

# peek.js

A framework for creating an application walkthrough in the browser. Here's an example of the minimum amount of markup required to create a working walkthrough.

#### Markup

```html
<html>
    <head>
        <link rel="stylesheet" href="css/peak.css">
        <link rel="stylesheet" href="css/theme/light.css">
    </head>
    <body>
        <div class="peek">
            <div class="slides">
                <section>Slide 1</section>
                <section>Slide 2</section>
            </div>
        </div>
        <script src="/js/peek.js"></script>
        <script>
            Peek.init()
        </script>
    </body>
</html>
```

## Hierarchy

The hierarchy of a *peek show* is as follows.

#### Overview
```
- peek
  - slides
    - slide
    - slide
```

Which translates into simple, hassle free markup.

#### Markup
```html
<div class="peek">
    <div class="slides">
        <section>Slide 1</section>
        <section>Slide 2</section>
    </div>
</div>
```

Each peek walkthrough supports any number of slides, such that a user can simply add a new slide by adding a new HTML `section`. No classes are directly involved with the addition of a single slide.

## Controls

Allows your users to navigate the peek show.

Any HTML element can be turned into a peek control by adding a `data-peek` attribute. The list of default methods currently available to the `data-peek` attribute are listed below.

#### Data Peek API

Method                | Action
---                   | ---
`data-peek-toggle `   | Toggles the peek drawer.
`data-peek-previous`  | Moves to the previous slide.
`data-peek-next `     | Moves to the next slide.

#### Hotkeys

By default a peek show can also be toggled and navigated using the predefined set of hotkeys listed below.

Key       | Action
---       | ---
Ctrl + ?  | Open / Close
&larr;    | Previous
&rarr;    | Next
&darr;    | Close
Spacebar  | Next
Esc       | Close

#### URL Hash

By default the URL hash will be updated when the peek drawer is toggled and when the user navigates from slide to slide.

**Example**

www.example.com/application#**peek=true**#**pslide=1**

*Where `peek=true` toggles the drawer to its open state and `pslide=1` sets the current, visible slide to slide one.*

This has the added advantage of adding the users current state to the browser history. It also allows for navigation to a specific slide within the peek show, provided the end user knows the slide number they wish to view.
