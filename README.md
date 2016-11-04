# vidim
## vidim is a no-dependencies library for displaying background videos in modern browsers (and IE9)

It supports all modern browsers, as well as IE9+. It's worth noting that a lot of mobile devices and tablets do not allow for automatic playback of videos (or their playback in the background), and since there is no universal and easy way to detect that, it's left up to you to figure it out. In the docs, I provide a more detailed description and explain what I used in the demo.

[Demo](https://originalexe.github.io/vidim/)

## What providers are supported
The library right now supports self hosted videos, as well as YouTube. Vimeo is not planned as it's not possible to elegantly hide the UI of their free player, and PRO users have an option of getting the video source directly anyway so they can still use this library with the self hosted provider.

## How to get started?
`npm install vidim`

I would also suggest [reading the docs](https://originalexe.github.io/vidim/#docs)

## How to contribute
Clone the repo, run
```
npm install
```
followed by
```
npm run test
```
and
```
npm run devWatch
```
Then, make changes in the `src` folder, check that tests pass and create a pull request with the changes. Also, make sure you install [editorconfig](http://editorconfig.org/) plugin for your editor, in order to follow the syntax of the project.

You can also help out by reporting any issues and feature requests :)
