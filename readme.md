

# Peek.js

Peek is a small javascript package that designers and developers alike can require to provide their users with simple walkthrough tutorials. To add a peek.js walkthrough the following code must be added to the body of the required HTML file.

```
<script src="path/to/peek.js"></script>
<script>Peek.init();</script>
```

## Hierarchy

The hierarchy of a peek show should be as follows.

**Overview**
```
- peek
  - slides
    - slide
    - slide
```

Which translates into simple, hassle free markup.

**HTML**
```
<div class="peek">
  <div class="slides">
    <section></section>
    <section></section>
  </div>
</div>
```

Each peek walkthrough supports any number of slides, such that a user can simply add a new slide by adding a new HTML `section`. No classes are directly involved with the addition of a single slide, making the experience as simple and pain free as possible.

## Controls

To allow your users to navigate the peek show, you will be required to add some UI elements.

Any HTML element can be turned into a peek control by adding a `data-peek` attribute. The list of default methods currently available to the `data-peek` attribute are listed below.

**Data Peek API**

Method                | Action
---                   | ---
`data-peek-toggle `   | Toggles the peek drawer.
`data-peek-previous`  | Moves to the previous slide.
`data-peek-next `     | Moves to the next slide.

**Hotkeys**

By default a peek show can also be toggled and navigated using the predefined set of hotkeys listed below.

Key    | Action
---    | ---
&larr; | Previous
&rarr; | Next
&darr; | Close
Spacebar | Next
Esc    | Close

**URL Hash**

By default the URL hash will be updated when the peek drawer is toggled and when the user navigates from slide to slide. This has the added advantage of adding the users current state to the browser history.

It also allows for navigation to a specific slide within the peek show, provided the end user knows the slide number they wish to view.
