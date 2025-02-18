---
date: 2025-02-18
title: Godot Components vs ECS
stage: draft
---

I've dabbled a fair bit with game development over the last five years.

Something you'll hear about frequently on the topic is "Components"; Usually it's accompanied by a lengthy explanation about the virtues of composition and how it can be used to create more maintainable, scalable code.

Some proponents will no doubt clickbait you into reading something about ECS (Entity Component System), which seems like a much more modern approach.

![](https://i.imgur.com/mzk47mC.jpeg)

> You think you ECS?

But first it's worth working out if you dear reader are in fact really using an ECS, or are you just being sensible about your codebase by utilising composition?

## Am I using an ECS architecture?

An ECS is a data-driven architecture that organises game entities into components. Each component holds data specific to the entity, such as position, velocity, or health.

### 1. Is it Data or Logic?

A component never contains logic, it is never executed or requires computation to access values. It is literally just a data structure of static values.

> 🤔 So the first clue that you're not actually using an ECS architecture is if what you call "components" seem to have methods or functions associated with them.

For example, in Godot, you might see something like this:

```gdscript
- Node: Scene Root
   - Node: Player (Node2D)
     - Node: HealthComponent (Node2D)
     - Node: MoveableComponent (Node2D)
     - Node: AnimatedMoveableComponent (Node2D)
       - Node: (AnimatedCharacter2D)
       - Node: IdleState (Node2D)
       - Node: WalkingState (Node2D)
```

The above is fairly typical of a Godot project; It's what every tutorial and article will encourage and guide you towards.

Almost every node will usually have some logic attached to it that executes some kind of function on every frame.

### 2. Do you have Components attached to Entities?

In ECS, components are attached to entities; Like I mentioned above, there can be many attached and they're just
data structures.

They can also not contain data but instead be mere indicators by virtue of their presence. ECS calls these kinds of components "tags".

If you're following any kind of composition pattern, then it might be hard to use this aspect as an indicator.

However what's unique about entities in ECS is that they are actually just an identifier; In most ECS systems they exist merely as a number in an array.

> 🤔 This is the next clue that you're not using an ECS architecture. If you access your entities as parent objects of your components (like you would in godot), then you're not using an ECS architecture.

### 3. Do you even system bro?

In ECS, systems are responsible for updating entities based on their components.

This is usually done by iterating over all the entities and checking if they have the required components and then applying the corresponding logic.

```ts title="A really obtuse system example"
function MovementSystem (
    delta: number,
    entities: number[],
    components: ComponentHash<number, (Moveable | Actor)>,
  ) {
    for (let i = 0; i < entities.length; i++) {
      const entityId = entities[i];
      const actor = components.find(
        (c) => c.entity === entityId && c.type === 'Actor',
      );
      const moveable = components.find(
        (c) => c.entity === entityId && c.type === 'Moveable',
      );
      if (!actor || !moveable) {
        continue;
      }
      components.set(entityId, 'actor', {
        x: actor.value.x + moveable.value.x,
        y: actor.value.y + moveable.value.y,
      });
      components.set(entityId, 'moveable', { x: 0, y: 0 });
    }
  }
}
```

In the above annoying example, you can see that we update the position component with information
from the velocity component.

> 🤔 So the 3rd indicator that you're not in ECS land is that this kind of logic is executing in bits and pieces attached to all your "entities". In ECS, movement code only exists in "systems" and it always involves updating data in a selection of related components.

## So why does it matter?

If you're just looking for a cool way to organise code so it scales nicely without necking yourself; Then it doesn't; Do what ever you want.

But if your intention was to actually do ECS then here's why it matters:

ECS was created as a performance optimisation technique to problems that uniquely apply to games: Thousands of moving entities on screen and a requirement to move them in a timely manner so that you can
achieve a smooth and fluid game-play experience.

This meant that the last part to a real ECS system is not just the Entities, the Components or even the
Systems, but rather the part almost no one talks about: how all that is organised into system memory for fast and efficient access.

Any ECS architecture that is in a interpreted language (Python, Javascript, Ruby, Lua etc) is just a fun little toy. They'll never be seriously used in production because you can not control the memory layout of your code.

## How does it work?

One of the most memorable resources I remember on the topic is a [talk given by Bob Nystrom](https://www.youtube.com/watch?v=JxI3Eu5DPwE) 👉

[![](https://img.youtube.com/vi/JxI3Eu5DPwE/0.jpg)](https://www.youtube.com/watch?v=JxI3Eu5DPwE)

Basically structuring all the information about your entities as data only allows it to be optimised in such a way that they can be stored in homogeneous memory locations, which means that you can access them very quickly. This is using an interpreted language won't give you the primary benefit of ECS.

## Conclusion

There isn't one really. This is more of a post to summarise some of my learning and perspectives on
ECS.

I can think of a way to actually have Systems and Components in Godot.
I doubt it would be a real ECS implementation due to the above regarding memory optimisation, but it'd be fun to see if we can still achieve some kind of nicely organised codebase. 🚀
