# Documentation
* [Library options](./options.md)

## Foreword
You may be wondering: "*Hey, why cannot I just use a simple visibility snippet like this:*"
```js
// Approximate code
function isElementInViewport(element) {
  const rect = element.getBoundingClientRect();

  return
    (rect.bottom > 0) &&
    (rect.right > 0) &&
    rect.left < (window.innerWidth || document.documentElement.clientWidth) &&
    rect.top < (window.innerHeight || document.documentElement.clientHeight);
}
```

Indeed, this and similar snippets are able to determine element's visibility. Moreover, a similar logic is used in Sentinel DOM for end-point areas comparison. However, these small snippets do not cover the following:

|   | Snippet | Sentinel DOM |
| - | -------- | ------------ |
| Performance | Performance optimization is up to you. | Analyzis is called only when the boundaries of the target are visible, otherwise no tracking is performed. A few other enhancements (i.e. throttling) shipped by default.
| Unique impressions | You need to create and maintain the logic. | Handled by internal `pool` variable, exposed to you inside the `callback` function. |
| Thresholds | Not complicated unless dealing with different scroll direction. | Handled automatically, regardless of scroll direction, resize and element animation.
| Tests | You need to write the tests to make sure tracking works as you expect. | All tests are written and maintained.

This, certainly, does not mean that you should not use these snippets. In some cases they may be more than enough, if the requirements towards tracking are plain and simple. However, from my experience, the latter may grow quite complex, yet somewhat repetitive.

I often find myself implementing the same things when providing visibility tracking for projects - handling unique impressions, custom thresholds and manual tracking (callback tracking), for example, for carousels. To prevent the repetition, I have decided to isolate my implementation into a library, which you and I can reuse for multiple projects and needs.
