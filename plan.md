

# The peak.js plan

Peak will be a small javascript package that designers and developers alike can require to provide their users with simple walkthrough tutorials. To add peak.js the following code must be added to the body of the required HTML file.

```
<script src="path/to/peak.js"></script>
```

## Hierarchy

The hierarchy of a peak show will be as follows.

**Plaintext**
```
- peak
  - slides
    - slide
    - slide
```

Where this translates into simple, hassle free markup.

**Markup**
```
- div.peak
  - div.slides
    - section
    - section
```

Each peak show should be able to support any number of slides, such that the user can simply add a new slide by adding a new section. No classes should be directly involved with the addition of a single slide. This should make the users' experience as simple and pain free as possible.

Each slide should be able to contain each of the following items, both together and separately.

- Title
- Body text
- Image

Such that the hierarchy of a peak slide is as follows.

**Plaintext**
```
- slide
  - title         (optional)
  - body text     (optional)
  - image         (optional)
```

Where this again translates into simple, hassle free markup.

**Markup**
```
- section
  - h1          (optional)
  - p           (optional)
  - img         (optional)
```

The markup for the above would make use of native HTML tags, with the minimal number of classes required. This would be the case in order to improve the user experience and make it as trivial as possible to add a new slide.

## Controls

The user should not be required to add any slide controls to their peak show, the controls should be dynamically added by the script. This should make the process of creating a peak show extremely simple as the user does not have to concern themselves with the navigation of the peak show.

The peak controls should appear on top of all other elements within the peak show. This will allow users to move between slides with ease. The controls should be injected in a similar order to the one shown below.

**Plaintext**
```
- peak
  - controls
  - slides    
    - slide
    - slide
```

This would roughly translate to the following markup.

**Markup**
```
- div.peak
  - div.controls
  - div.slides
    - section
    - section
```

Where the controls would consist of *previous slide*, *next slide* and *close peak* buttons. Such that the hierarchy of the peak controls would be as follows.

**Plaintext**
```
- controls
  - previous
  - close
  - next
```

Where this again translates into simple, hassle free markup.

**Markup**
```
- div.controls
  - button.previous
  - button.close
  - button.next
```

The peak show should also be able to receive control through the use of he keyboard keys as this will improve the experience for the end user. The keyboard keys should have the following use cases.

Key    | Action
---    | ---
&larr; | Previous
&rarr; | Next
&uarr; | Previous
&darr; | Next
Spacebar | Next
Esc    | Close
