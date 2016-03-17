

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

The hierarchy of a peek walkthrough is as follows.

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

Each peek walkthrough supports any number of slides, such that a user can simply add a new slide by adding a new HTML `<section>`. No classes are directly involved with the addition of a single slide.

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

www.example.com/application#peek=true#pslide=1

*Where `peek=true` toggles the drawer to its open state and `pslide=1` sets the current, visible slide to slide one.*

This has the added advantage of adding the users current state to the browser history. It also allows for navigation to a specific slide within the peek show, provided the end user knows the slide number they wish to view.


## Javascript API

A single global object called `Peek` is exposed. The object contains several methods to perform actions on the current peek walkthrough.

**Available methods**

Method                | Action
---                   | ---
`Peek.toggle()`       | Toggles the peek drawer.
`Peek.previous()`     | Moves to the previous slide.
`Peek.next()`         | Moves to the next slide.
`Peek.destroy()`      | Destroys an instance of a walkthrough.
`Peek.isActive()`     | Returns true if active, otherwise false.
`Peek.slides.getIndexes()` | Get previous, current and next slide indexes.
`Peek.slides.getSize()` | Get the number of slides.
`Peek.slides.setCurrent(index)` | Sets the index of the current slide.

#### Multiple Walkthrough's

Using the destroy method on an instance of a Peek walkthrough can allow for multiple walkthrough's. An example of how you could implement two walkthrough's is provided below.

```javascript
var peek1;
var peek2;

peek1 = new Peek(document.getElementById('peek1'));
peek1.next();
peek1.destroy();

peek2 = new Peek(document.getElementById('peek2'));
peek2.next();
```
