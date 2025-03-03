---
date: 2025-03-03
title: ECS in Godot with CSharp
draft: true
filepath: content/posts/2025-03-03-ecs-in-godot-with-csharp.md
---

I've been getting familiar with the csharp language by (attempting to) creating a game.

I might finish this game... might not. I hope I do, but I think for me the point is that it's fun.

Anyway, previously I wrote a post on what my understanding of ECS is and how you'd know if you're really implementing an ECS architecture. This time it's going to be about how to get closer to an ECS system in Godot.

> Disclaimer: This isn't a real ECS architecture as it doesn't enforce the memory allocation aspects of such an architecture.

## Godot Nodes and the Godot Editor

For those that don't know Godot is a game engine and editor IDE that has a pretty good UX. It largely revolves around the idea that the information required for a scene is structured in a tree hierarchy of nodes.

Each of these nodes can be clicked on and it's properties manipulated via the UI. There's different UI elements for things like managing tile maps, sprite animations, sounds, animation curves, even your own elements provided by code in your project.

For the purposes of this post, all we need to establish here is that

- I want to continue this trend
- I want my entities to be nodes that are part of a particular godot group (which really just means it's tagged in some way)
- I want my components to also be nodes that are child nodes of my entity.

So you can think of this hierarchy as looking like

```sh
Scene (Node)
 - EntityManager (Node)
 - EventManager (Node)
 - AnimationSystem (Node)
 - BehaviourTreeSystem (Node)
 - InputSystem (Node)
 - MovementSystem (Node)
     + EventManagerPath
 - Actor (CharacterBody2D)
   - (AnimatedSprite2D)
     - (CollisionShape2D)
   - PositionComponent (Node)
   - VelocityComponent (Node)
       + MaxSpeed
       + MinSpeed
       + Acceleration
   - InputComponent (Node)
   - RenderableComponent (Node)
       + RenderNodePath
   - BehaviourTreeComponent (Node)
       + BehaviourResource
```

Each node has an attached csharp class that extends from the same class as the node it's attached to and some of them even have their properties annotated in order to be made available in the Godot editor UI.

## Entities, Components and Systems

So the first thing you need in an ECS architecture is a way to register or create entities, add components to those entities and then a way to discover entities with those components.

For my purposes, I achieve this by attaching a class to a node in my scene that will allow me to manage components on entities.

```cs title="core/EntityManager"
    interface EntityManager: Node {

        public IEnumerable<Node> Entities { get; }

        public void _Ready();

        public T AddComponent<T>(Node entity, T component) where T : core.BaseComponent;

        public void RemoveComponent<T>(Node entity) where T : core.BaseComponent;

        public void RemoveComponent<T>(Node entity, string id) where T : core.BaseComponent;

        // Get a component node of type T from an entity
        public T GetComponent<T>(Node entity) where T : core.BaseComponent;

        public T GetComponent<T>(Node entity, string id) where T : core.BaseComponent;

        // Returns multiple components on an entity that match
        public IEnumerable<T> GetComponents<T>(Node entity) where T : core.BaseComponent;

        // Returns multiple components on an entity that match
        public IEnumerable<T> GetComponents<T>(Node entity, string id) where T : core.BaseComponent;

        // Check if an entity has a component of type T
        public bool HasComponent<T>(Node entity) where T : core.BaseComponent;

        // Check if an entity has a idenfiable component of type T
        public bool HasComponent<T>(Node entity, string id) where T : core.BaseComponent;

        // Get all entities with specific component types
        public List<Node> GetEntitiesWithComponents(params System.Type[] componentTypes);
    }
}
```

As we'll soon see the primary methods used here will be `GetComponent` and `GetEntitiesWithComponents`.

When the scene starts up, `EntityManager._Ready` is called where we grab all the nodes in the `entities` group and store them as a list of nodes.

Because our entity manager and entities are nodes, Godot handles calling their `_PhysicsProcess` and/or `_Process` method each tick. It is in each tick of a system that we'll often call `GetEntitiesWithComponents` to perform operations on specific entities.

The complete the foundation of our pseudo ECS architecture we should have a way to bridge communication with other aspects of our game that don't necessarily benefit from such an architecture: The UI.

```cs title="Game.cs" subtext="foo bar' caption="While not required, this class demonstrates how our UI components can be notified of changes in our ECS world."
using Godot;

public partial class Main : Node
{
    private core.EntityManager _entityManager;
    private core.EventManager _eventManager;

    public override void _Ready()
    {
        _eventManager = GetNode<core.EventManager>("EventManager");
        _entityManager_ = GetNode<core.EntityManager>("EntityManager");

        // Subscribe to interesting events and do something globally about them.
        _eventManager.Subscribe<events.EntityMovedEvent>(OnEntityMoved);
    }

    private void OnEntityMoved(events.EntityMovedEvent evt)
    {
        // GD.Print($"Entity {evt.EntityId} moved from ({evt.OldX}, {evt.OldY}) to ({evt.NewX}, {evt.NewY})");
    }
}
```

## Systems

Typically "systems" in ECS will perform some operations with a selection of entities with the required components, since our "systems" will just be godot nodes with csharp classes attached, we need a way for these systems to describe which entities they're interested in.

Here I've started with a base class that needs a reference to the EntityManager Node in the scene. The `[Export]` annotation allows me to declare to Godot that it should generate some IDE UI controls for this instances field. Once compiled, I can now drag the `EntityManager` in the scene onto that UI field and at runtime I can resolve that `NodePath` to the instances of the `EntityManager`.

This is a running theme in any System or Component that needs to know about things not strictly within it's own domain. It means I can further decouple implementations.

To facilitate a common set of tasks a system requires, I've made a `core.BaseSystem` class :

```cs title="BaseSystem"
namespace core
{

    public partial class BaseSystem : Node, ISystem
    {
        [Export]
        public NodePath EntityManagerPath { get; set; }

        public core.EntityManager _entityManager { get; set; }


        public List<Type> requiredComponents { get; set; }

        public BaseSystem()
        {
            requiredComponents = new List<Type>();
        }

        public override void _Ready()
        {
            base._Ready();
            _entityManager = GetNode<core.EntityManager>(EntityManagerPath);

        }

        public virtual List<Node> GetEntities()
        {

            List<Node> entities = _entityManager.GetEntitiesWithComponents(
                requiredComponents.ToArray()
            );

            return entities;
        }

    }

}
```

When a system comes to life, it'll register it's required component types. These get used on every tick to obtain a
slice of entities that have all those components.

If you refer to the initial chart at the start, you'll notice I have several systems. Lets take the easiest and most predictably boring ones to demonstrate how this architecture in Godot works.

```cs title="MovementSystem" caption="I'm sure there's some improvements to be made here. Perhaps a type parameter for the node."
public partial class MovementSystem : core.BaseSystem
{

    public MovementSystem()
    {
        requiredComponents.Add(typeof(components.PositionComponent)); // 1️⃣
        requiredComponents.Add(typeof(components.VelocityComponent));
    }

    public override void _Process(double delta)
    {
        base._Process(delta);

        List<Node> entities = GetEntities(); 2️⃣

        foreach (var entity in entities)
        {
            // ignore it if it is not a CharacterBody2D.
            if (!(entity is Godot.CharacterBody2D characterBody2D)) // 3️⃣
            {
                GD.PrintErr("Entity is not a CharacterBody2D. Skipping...", entity);
                continue;
            }

            components.PositionComponent position = _entityManager.GetComponent<components.PositionComponent>(entity); // 4️⃣
            components.VelocityComponent velocity = _entityManager.GetComponent<components.VelocityComponent>(entity);

            Move(
                entity.Name,
                characterBody2D,
                velocity,
                position
            );
        }
    }
}
```

1. We add the components we require, which is used to ...
2. Select our known entities with our required components.
3. We only want to work with entities that are `CharacterBody2D` nodes, since these are our manifestations of the moveable object.
4. We pick our components for velocity and position

And that's it.

It gets more interesting when we add a `BehaviourTreeComponent` or an `InputComponent`, since the related systems will end up modifying
the data stored in the above entities components and cause them to move!

## Components

To give our systems something to work with, we need to start attaching components to our entities. At the start of this post I revealed a chart
of nodes, one of which you'll notice is an `InputComponent`

```cs title="InputComponent"
using Godot;

namespace components
{
    [GlobalClass]
    public partial class InputComponent : core.BaseComponent {}
}
```

And the system

```cs title="InputSystem"  caption="This just captures information from the global input controller Godot provides"
using Godot;
using System.Collections.Generic;

namespace systems
{
    [GlobalClass]
    public partial class InputSystem : core.BaseSystem
    {

        public InputSystem(): base()
        {

            requiredComponents.Add(typeof(components.InputComponent));
            // we don't modify this, but controlling an entity without position doesn't make sense.
            requiredComponents.Add(typeof(components.PositionComponent));
            requiredComponents.Add(typeof(components.VelocityComponent));
        }

        public override void _Process(double delta)
        {
            base._Process(delta);

            List<Node> entities = GetEntities();
            if (entities.Count <= 0)
            {
                return;
            }

            // player can only control one at a time.
            Node controlledEntity = entities[0];


            components.VelocityComponent vel = _entityManager.GetComponent<components.VelocityComponent>(controlledEntity);
            vel.Velocity = Vector2.Zero;
            vel.Velocity = Input.GetVector("ui_left", "ui_right", "ui_up", "ui_down");

        }
    }
}
```

So here we just end up replacing the `Vector2` on the velocity component with a new one provided by the global Godot input controller.

On the next tick, the `MovementSystem` will read that new data and move our Actor entity that contains the `InputComponent`

## Closing notes

This is the basics of a ECS architecture from the composition point of view. Since it runs in Godot we're obviously not going to be able
to fully implement the memory storage aspects of ECS; However if you search for "Godot Object Pools", there seems to be some interesting
concepts that might overlap with this simple ecs setup I've outlined here.

Another thing I've hinted at here but not described at all is Behaviour Trees. This deserves a post on its own, so look out for that once
I've fully wrapped my head around the concept.

peace.
