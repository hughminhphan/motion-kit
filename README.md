# motion kit

claude's videos move like claude. everything fades up 24 px, eases out on `power3.out` over 0.6 s, staggers 0.08 s apart, then sits still. that's not claude being lazy, it's written down: hyperframes' own animation guide sets `gsap.defaults({ duration: 0.6, ease: "power3.out" })` as the house default, so every agent that follows it lands on the same look.

this is the skill i use instead. it gets claude to animate the way an after effects animator keys things: a curve per property, a duration from how far and how heavy the thing is, one element leading and the rest reacting, and most text just cut on.

same chart, same layout, same beat times. only the motion changes:

![before and after](examples/before-after/before-after.gif)

left is the house default, right is this kit. full quality mp4s are in [examples/before-after/renders](examples/before-after/renders).

## what changes

| the default | why it reads as ai | what the kit does instead |
|---|---|---|
| one named preset (`power3.out`) on every tween | every move has the same speed shape | a hand-shaped curve per move and per property, named by what it does (`kit.land`, `kit.heavy`, `kit.whip`), plus easings.net, material 3 and ibm carbon curves by name |
| 0.4 to 0.6 s for everything | a chip and a full screen panel take the same time | duration from distance and weight: `dur(px, weight)` |
| even 0.08 s staggers | reads like a loop, not a chain of causes | one element leads, the rest react at uneven offsets (0, 4, 9, 15, 22, 30 frames) |
| everything fades up | soft, late, template | most text cuts on, written text types on, titles settle their tracking |
| static holds | the frame dies between moves | a camera that drifts, holds that stay alive |

## install

it's a claude code skill. clone it and link the folder into your skills dir:

```bash
git clone https://github.com/hughminhphan/motion-kit.git
mkdir -p ~/.claude/skills
ln -s "$PWD/motion-kit/skills/motion-designer" ~/.claude/skills/
```

then ask claude for a video as usual. the skill tells it to read the motion library before animating, vendor `motion-kit.js` into the composition and author with it. it's built for [hyperframes](https://github.com/heygen-com/hyperframes) but works on any gsap timeline, and the curves are plain cubic-beziers, so the same numbers go into css, after effects or blender.

## what's in it

| file | what it is |
|---|---|
| [skills/motion-designer/SKILL.md](skills/motion-designer/SKILL.md) | the rules claude follows: no presets as defaults, timing from distance, reactions not staggers, text treatments, restraint |
| [skills/motion-designer/LIBRARY.md](skills/motion-designer/LIBRARY.md) | the motion library: registers, every curve with its source, springs, timing, devices, text treatments, the after effects tools, a checklist |
| [skills/motion-designer/motion-kit.js](skills/motion-designer/motion-kit.js) | the code. seek-safe gsap helpers: every curve by name, `dur`, `react`, `arc`, `anticipate`, `drag`, `spring`, text treatments (`cut`, `typeOn`, `trackIn`, `scramble`, `wipe`) and after effects tools (`wiggle`, inertial bounce, `loopOut`, time remap, null + pick-whip) |
| [examples/before-after](examples/before-after) | the scene above, built twice. diff the two `index.html` files to see every change |

## render the example yourself

```bash
cd examples/before-after/after
npx hyperframes render --output after.mp4
```

## licence

my files are MIT (see [LICENSE](LICENSE)). the examples vendor gsap under its own [standard licence](https://gsap.com/standard-license) and vercel's [geist](https://github.com/vercel/geist-font) font under the SIL open font licence. curve values come from [easings.net](https://easings.net), [material 3](https://m3.material.io/styles/motion/easing-and-duration) and [ibm carbon](https://carbondesignsystem.com/elements/motion/overview/).

i'm hugh. i make instagram reels for hardware, robotics and dev tool companies, and i post how on [@hugh_candoit](https://www.instagram.com/hugh_candoit/).
