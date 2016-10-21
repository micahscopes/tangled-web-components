# Graph Components
skatejs + d3 + math → graph (as in graph theory) web components.

#### ~ very experimental ~

As well as a very special and original `puppy-dog` element, a `handle-box` element, a fancy algorithm for calculating the intersection of a line and a rectangle, and some colorful, smudgy images made in krita.

## Notes
##### Try the examples:
```bash
% npm -g install superstatic
% superstatic
```
Then open the browser to `http://localhost:3474/examples/`.

##### Compile:
```bash
% npm install
% npm run build
```
## Examples
A dog on a scooter.
```html
<puppy-dog></puppy-dog>
```
Three dogs on scooters in a totally connected graph:
```html
<graph-container>
  <edges-all-pairs></edges-all-pairs>
  <puppy-dog></puppy-dog>
  <puppy-dog></puppy-dog>
  <puppy-dog></puppy-dog>
</graph-container>
```
Using an adjacency matrix to define the edges.
```html
<graph-container>
  <edges-adjacency-matrix>
    [[0,1,0],[0,0,1],[1,0,0]]
  </edges-adjacency-matrix>
  <div>reduce</div>
  <div>reuse</div>
  <div>recyle</div>
</graph-container>
```
The `handle-box` element makes its contents draggable:
```html
<graph-container>
  <handle-box>
    <h1>grab this</h1>
  </handle-box>
  <handle-box>
    <h1>grab this</h1>
  </handle-box>
<edges-all-pairs></edges-all-pairs>
</graph-container>
```

Okay! Hope you enjoy!
